import { z } from "zod";
import { archiveRecordTypes, verificationStatuses } from "./types";

export const contributionProposalSchema = z.object({
  id: z.string().min(1),
  targetRecordId: z.string().min(1),
  targetType: z.enum([...archiveRecordTypes, "new-record"] as [string, ...string[]]),
  field: z.string().min(1),
  proposedValue: z.unknown(),
  reason: z.string().min(1),
  sourceCitation: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  locator: z.string().min(1).optional(),
  contributor: z.string().min(1),
  mediaAttribution: z.string().min(1).optional(),
  mediaLicense: z.string().min(1).optional(),
  requestedStatus: z.enum(verificationStatuses),
  submittedAt: z.string().datetime({ offset: true }),
});

export type ContributionProposal = z.infer<typeof contributionProposalSchema>;

export function validateContributionProposal(input: unknown) {
  return contributionProposalSchema.safeParse(input);
}
