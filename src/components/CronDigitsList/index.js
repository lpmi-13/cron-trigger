import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
});

const CronDigitsList = ({ cronDigits, handleReorder }) => {

  const [digits, setDigits] = useState(cronDigits);

  useEffect(() => {
    setDigits(cronDigits)
  }, [cronDigits])

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      digits,
      result.source.index,
      result.destination.index
    );

    setDigits(items);
    handleReorder(items)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable  droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div
            className="cronSelection"
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {digits.map((item, index) => (
              <Draggable key={item.originalIndex} draggableId={item.originalIndex.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    className="cronItem"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {item.item}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default CronDigitsList