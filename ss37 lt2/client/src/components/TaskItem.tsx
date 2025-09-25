import { IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import React from 'react';

interface TaskItemProps {
  id: number;
  name: string;
  age: number;
  grade: string;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ id, name, age, grade, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm mb-2">
      <div className="flex items-center flex-col">
        <span>{name}</span>
        <span className="text-[11px] text-[#BFC9D0]">
          Age {age} <FiberManualRecordIcon sx={{ fontSize: 5 }} /> Grade: {grade}
        </span>
      </div>
      <div>
        <IconButton>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(id)}>
          <Delete />
        </IconButton>
      </div>
    </div>
  );
};

export default TaskItem;
