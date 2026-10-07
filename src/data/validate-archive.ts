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
      data.bibliographicSources.map((entry) => entry.id),
      "bibliographic source ID",
    ),
    ...duplicateValues(
      data.provenanceV2.map((entry) => entry.id),
      "provenance v2 ID",
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
  const bibliographicSourceIds = new Set(
    data.bibliographicSources.map((entry) => entry.id),
  );
  const provenanceV2Ids = new Set(data.provenanceV2.map((entry) => entry.id));
  const relationIds = new Set(relations.map((entry) => entry.id));
  const sourceCaptureIds = new Set(sources.map((entry) => entry.id));

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
   * Provenance v2 normalizes bibliographic identities while preserving every
   * migrated source capture. No v2 field may strengthen legacy evidence.
   */
  const bibliographicCaptureOwners = new Map<string, string>();

  for (const source of data.bibliographicSources) {
    if (source.captureIds.length === 0) {
      errors.push(`Bibliographic source ${source.id} has no source captures`);
    }

    for (const captureId of source.captureIds) {
      if (!sourceCaptureIds.has(captureId)) {
        errors.push(
          `Bibliographic source ${source.id} references missing source capture ${captureId}`,
        );
        continue;
      }

      const previousOwner = bibliographicCaptureOwners.get(captureId);
      if (previousOwner) {
        errors.push(
          `Source capture ${captureId} belongs to multiple bibliographic sources: ${previousOwner}, ${source.id}`,
        );
      } else {
        bibliographicCaptureOwners.set(captureId, source.id);
      }
    }
  }

  for (const captureId of sourceCaptureIds) {
    if (!bibliographicCaptureOwners.has(captureId)) {
      errors.push(
        `Source capture ${captureId} is not represented by a normalized bibliographic source`,
      );
    }
  }

  const provenanceV2ById = new Map(
    data.provenanceV2.map((assertion) => [assertion.id, assertion] as const),
  );

  for (const assertion of data.provenanceV2) {
    if (!recordIds.has(assertion.recordId)) {
      errors.push(
        `Provenance v2 ${assertion.id} references missing record ${assertion.recordId}`,
      );
    }

    if (!bibliographicSourceIds.has(assertion.bibliographicSourceId)) {
      errors.push(
        `Provenance v2 ${assertion.id} references missing bibliographic source ${assertion.bibliographicSourceId}`,
      );
    }

    if (assertion.sourceCaptureIds.length === 0) {
      errors.push(`Provenance v2 ${assertion.id} has no source capture`);
    }

    for (const captureId of assertion.sourceCaptureIds) {
      if (!sourceCaptureIds.has(captureId)) {
        errors.push(
          `Provenance v2 ${assertion.id} references missing source capture ${captureId}`,
        );
        continue;
      }

      if (bibliographicCaptureOwners.get(captureId) !== assertion.bibliographicSourceId) {
        errors.push(
          `Provenance v2 ${assertion.id} source capture ${captureId} is not owned by its bibliographic source`,
        );
      }
    }

    const owner = records.find((record) => record.id === assertion.recordId);
    if (owner && !owner.provenanceIds.some((id) => id === assertion.id.replace("provenance-v2:", ""))) {
      errors.push(
        `Provenance v2 ${assertion.id} has no corresponding v1 provenance ownership`,
      );
    }

    if (assertion.evidenceRole === "claim-level" && !assertion.claimId) {
      errors.push(`Claim-level provenance v2 ${assertion.id} must have claimId`);
    }

    if (assertion.checkedAt && Number.isNaN(Date.parse(assertion.checkedAt))) {
      errors.push(`Provenance v2 ${assertion.id} has invalid checkedAt`);
    }
  }

  for (const assertion of provenance) {
    const v2Id = `provenance-v2:${assertion.id}`;
    const v2 = provenanceV2ById.get(v2Id);
    if (!v2) {
      errors.push(
        `V1 provenance ${assertion.id} has no normalized provenance v2 assertion`,
      );
      continue;
    }

    if (
      v2.recordId !== assertion.recordId ||
      v2.verificationStatus !== assertion.verificationStatus ||
      v2.evidenceRole !== assertion.evidenceRole ||
      v2.sourceCaptureIds.length !== 1 ||
      v2.sourceCaptureIds[0] !== assertion.sourceId
    ) {
      errors.push(
        `Provenance v2 ${v2Id} does not preserve its v1 assertion semantics`,
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
