export default function KanbanBoard() {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="bg-gray-100 p-2 rounded">To Review</div>
        <div className="bg-gray-100 p-2 rounded">Interview</div>
        <div className="bg-gray-100 p-2 rounded">Offer</div>
        <div className="bg-gray-100 p-2 rounded">Hired</div>
      </div>
    );
  }
  