export default function JobFilterBar({ onFilter }: { onFilter: (q: string) => void }) {
    return (
      <div className="flex gap-2 p-2">
        <input
          type="text"
          placeholder="Search jobs..."
          className="border rounded p-2 flex-1"
          onChange={(e) => onFilter(e.target.value)}
        />
      </div>
    );
  }
  