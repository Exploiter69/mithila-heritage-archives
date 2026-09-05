import { canonicalArchive } from "./archive-foundation";
import { assertArchiveIsValid } from "./validate-archive";

const result = assertArchiveIsValid(canonicalArchive);

console.info(
  `Archive validation passed: ${canonicalArchive.records.length} records, ` +
    `${canonicalArchive.sources.length} sources, ` +
    `${canonicalArchive.media.length} media records, ` +
    `${canonicalArchive.provenance.length} provenance assertions, ` +
    `${canonicalArchive.relations.length} relations.`,
);

void result;
