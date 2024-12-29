import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Option } from "@/pages/admin/quiz/[id]/edit";

interface SortableItemProps {
  id: string;
  option: Option;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onToggleCorrect: (id: string) => void;
  onTextChange: (text: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  option,
  onAdd,
  onRemove,
  onToggleCorrect,
  onTextChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 border p-2 rounded bg-gray-100"
    >
      <div {...listeners} {...attributes} className="cursor-grab">
        <PiDotsThreeVerticalBold size={24} />
      </div>
      <input
        type="text"
        className="outline-none flex-1 p-2 border rounded"
        value={option.text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Enter option text"
      />
      <button
        type="button"
        onClick={() => onToggleCorrect(id)}
        className="text-green-500"
      >
        {option.isCorrect ? <FaCheckCircle size={24} /> : <FaRegCheckCircle size={24} />}
      </button>
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="text-red-500"
      >
        <CiCircleMinus size={24} />
      </button>
      <button
        type="button"
        onClick={onAdd}
        className="text-blue-500"
      >
        <CiCirclePlus size={24} />
      </button>
    </div>
  );
};

export default SortableItem;
