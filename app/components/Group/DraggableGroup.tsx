import { useDrag, useDrop } from "react-dnd";
import Group from "./Group";


type DraggableGroupProps = {
  onUpdate: ({ id, name, enabled }: { id: string, name?: string, enabled?: boolean }) => void;
  onDelete: ({ id }: { id: string }) => void;
  group: GroupType;
  index: number,
  moveGroup: any;
  group_name: string;
}

const DraggableGroup: React.FC<DraggableGroupProps> = ({
  onUpdate,
  onDelete,
  group,
  index,
  moveGroup,
  group_name
}) => {
  const [, ref] = useDrag({
    type: group_name,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: group_name,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveGroup(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) ref(node);
        drop(node);
      }}
    >
      <Group
        onUpdate={onUpdate}
        onDelete={onDelete}
        {...group}
      />
    </div>
  );
}

export default DraggableGroup;