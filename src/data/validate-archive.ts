import { canonicalArchiveSchema } from "./archive-schema";
import type { CanonicalArchiveData } from "./types";

export interface ArchiveValidationResult {
  valid: boolean;
  errors: string[];
}

function duplicateValues(values: string[], label: string): string[] {
  const seen = new Set<string>();

  return values.flatMap((value) => {
    if (seen.has(value)) return [`Duplicate ${label}: ${value}`];
    seen.add(value);
    return [];
  });
}

/**
 * Validates the canonical archive graph and its object shapes.
 *
 * This module is intentionally side-effect free so it can be imported
 * by tests, tooling, or application code without executing validation.
 */
export function validateArchive(data: CanonicalArchiveData): ArchiveValidationResult {
  const errors: string[] = [];

  const parsed = canonicalArchiveSchema.safeParse(data);

  if (!parsed.success) {
    errors.push(
      ...parsed.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      ),
    );

    return { valid: false, errors };
  }

  const { records, sources, media, provenance, relations } = parsed.data;

  errors.push(
    ...duplicateValues(
      records.map((entry) => entry.id),
      "record ID",
    ),
    ...duplicateValues(
      sources.map((entry) => entry.id),
      "source ID",
    ),
    ...duplicateValues(
      media.map((entry) => entry.id),
      "media ID",
    ),
    ...duplicateValues(
      provenance.map((entry) => entry.id),
      "provenance ID",
    ),
    ...duplicateValues(
      relations.map((entry) => entry.id),
      "relation ID",
    ),
    ...duplicateValues(
      records.map((entry) => `${entry.type}:${entry.slug}`),
      "(type, slug)",
    ),
  );

  const recordIds = new Set(records.map((entry) => entry.id));
  const sourceIds = new Set(sources.map((entry) => entry.id));
  const mediaIds = new Set(media.map((entry) => entry.id));
  const provenanceIds = new Set(provenance.map((entry) => entry.id));
  const relationIds = new Set(relations.map((entry) => entry.id));

  const representationIds = new Set<string>();

  for (const record of records) {
    for (const representation of record.representations) {
      if (representationIds.has(representation.id)) {
        errors.push(`Duplicate representation ID: ${representation.id}`);
      }

      representationIds.add(representation.id);
    }
  }

  for (const record of records) {
    /*
     * Published records must have provenance.
     * Draft and withdrawn records remain independently representable.
     */
    if (
      record.contentStatus === "published" &&
      record.provenanceIds.length === 0
    ) {
      errors.push(
        `Published record ${record.id} has no required provenance assertion`,
      );
    }

    for (const sourceId of record.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        errors.push(
          `Record ${record.id} references missing source ${sourceId}`,
        );
      }
    }

    for (const mediaId of record.mediaIds) {
      if (!mediaIds.has(mediaId)) {
        errors.push(
          `Record ${record.id} references missing media ${mediaId}`,
        );
        continue;
      }

      const item = media.find((candidate) => candidate.id === mediaId);

      if (item && item.recordId !== record.id) {
        errors.push(
          `Record ${record.id} references media ${mediaId} for another record`,
        );
      }
    }

    for (const provenanceId of record.provenanceIds) {
      if (!provenanceIds.has(provenanceId)) {
        errors.push(
          `Record ${record.id} references missing provenance ${provenanceId}`,
        );
        continue;
      }

      const assertion = provenance.find(
        (item) => item.id === provenanceId,
      );

      if (assertion?.recordId !== record.id) {
        errors.push(
          `Record ${record.id} references provenance ${provenanceId} for another record`,
        );
      }

      if (
        assertion &&
        !record.sourceIds.includes(assertion.sourceId)
      ) {
        errors.push(
          `Record ${record.id} provenance ${provenanceId} uses an unlisted source`,
        );
      }
    }

    for (const relationId of record.relationIds) {
      if (!relationIds.has(relationId)) {
        errors.push(
          `Record ${record.id} references missing relation ${relationId}`,
        );
        continue;
      }

      const relation = relations.find(
        (candidate) => candidate.id === relationId,
      );

      if (
        relation &&
        relation.fromRecordId !== record.id &&
        relation.toRecordId !== record.id
      ) {
        errors.push(
          `Record ${record.id} references unrelated relation ${relationId}`,
        );
      }
    }

    for (const representation of record.representations) {
      if (
        representation.origin.module === "archive.ts" &&
        !representation.origin.exportName
      ) {
        errors.push(
          `Record ${record.id} has a representation without an export name`,
        );
      }
    }
  }

  /*
   * Source ownership and representation references.
   */
  for (const source of sources) {
    if (source.captureKind === "record-citation") {
      if (!source.representationId) {
        errors.push(
          `Record-citation source ${source.id} has no representationId`,
        );
      } else if (!representationIds.has(source.representationId)) {
        errors.push(
          `Source ${source.id} references missing representation ${source.representationId}`,
        );
      }
    }

    if (source.captureKind === "bibliography-entry" && source.representationId) {
      errors.push(
        `Bibliography source ${source.id} must not have a representationId`,
      );
    }

    if (source.representationId) {
      const owner = records.find((record) =>
        record.representations.some(
          (representation) =>
            representation.id === source.representationId,
        ),
      );

      if (!owner) {
        errors.push(
          `Source ${source.id} references representation ${source.representationId} with no owning record`,
        );
      } else if (!owner.sourceIds.includes(source.id)) {
        errors.push(
          `Source ${source.id} is not listed by owning record ${owner.id}`,
        );
      }
    }
  }

  /*
   * Provenance assertions must be owned by their record in both directions.
   */
  for (const assertion of provenance) {
    if (!recordIds.has(assertion.recordId)) {
      errors.push(
        `Provenance ${assertion.id} references missing record ${assertion.recordId}`,
      );
      continue;
    }

    if (!sourceIds.has(assertion.sourceId)) {
      errors.push(
        `Provenance ${assertion.id} references missing source ${assertion.sourceId}`,
      );
    }

    const owner = records.find(
      (record) => record.id === assertion.recordId,
    );

    if (owner && !owner.provenanceIds.includes(assertion.id)) {
      errors.push(
        `Provenance ${assertion.id} is not listed by record ${owner.id}`,
      );
    }

    if (owner && !owner.sourceIds.includes(assertion.sourceId)) {
      errors.push(
        `Provenance ${assertion.id} uses source ${assertion.sourceId} not listed by record ${owner.id}`,
      );
    }
  }

  /*
   * Media ownership must be represented in both directions.
   */
  for (const item of media) {
    if (!recordIds.has(item.recordId)) {
      errors.push(
        `Media ${item.id} references missing record ${item.recordId}`,
      );
      continue;
    }

    const owner = records.find(
      (record) => record.id === item.recordId,
    );

    if (owner && !owner.mediaIds.includes(item.id)) {
      errors.push(
        `Media ${item.id} is not listed by record ${owner.id}`,
      );
    }
  }

  /*
   * Relations are graph edges. Both endpoint records must own the edge.
   */
  for (const relation of relations) {
    if (
      !recordIds.has(relation.fromRecordId) ||
      !recordIds.has(relation.toRecordId)
    ) {
      errors.push(
        `Relation ${relation.id} references a missing record`,
      );
    }

    if (relation.fromRecordId === relation.toRecordId) {
      errors.push(
        `Relation ${relation.id} cannot relate a record to itself`,
      );
    }

    if (relation.sourceIds.length === 0) {
      errors.push(
        `Relation ${relation.id} has no source support`,
      );
    }

    for (const sourceId of relation.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        errors.push(
          `Relation ${relation.id} references missing source ${sourceId}`,
        );
      }
    }

    const fromRecord = records.find(
      (record) => record.id === relation.fromRecordId,
    );

    const toRecord = records.find(
      (record) => record.id === relation.toRecordId,
    );

    if (fromRecord && !fromRecord.relationIds.includes(relation.id)) {
      errors.push(
        `Relation ${relation.id} is not listed by fromRecord ${fromRecord.id}`,
      );
    }

    if (toRecord && !toRecord.relationIds.includes(relation.id)) {
      errors.push(
        `Relation ${relation.id} is not listed by toRecord ${toRecord.id}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function assertArchiveIsValid(
  data: CanonicalArchiveData,
) {
  const result = validateArchive(data);

  if (!result.valid) {
    throw new Error(
      `Archive validation failed:\n${result.errors.join("\n")}`,
    );
  }

  return result;
}
