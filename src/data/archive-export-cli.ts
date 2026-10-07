import { getPublicArchiveEnvelope } from "./archive-export";

const payload = getPublicArchiveEnvelope();
process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
