import { Candidate } from "../../types/candidate";

export default function CandidateRow({ candidate }: { candidate: Candidate }) {
  return (
    <div className="flex justify-between border-b p-2">
      <div>{candidate.name}</div>
      <div className="text-sm text-gray-500">{candidate.stage}</div>
    </div>
  );
}
