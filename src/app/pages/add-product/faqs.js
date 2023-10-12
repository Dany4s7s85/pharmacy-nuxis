import {

  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AccordionFaq from './Accordion';
import { generateRandom } from '../../helpers/formatting';
import useDraggableInPortal from '../../hooks/useDragable';
import AddIcon from '@mui/icons-material/Add';
import './addproduct.scss';
const Faqs = ({ parentProps, setShowFaqInputs, showFaqInputs }) => {
  const renderDraggable = useDraggableInPortal();

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(parentProps?.values?.faqs);
    const [reorderedItem] = items.splice(result?.source?.index, 1);
    items.splice(result?.destination?.index, 0, reorderedItem);

    parentProps.setValues({ ...parentProps?.values, faqs: items });
  }

  const handleAddFaq = () => {
    setShowFaqInputs(true);
  };

  return (
    <>
      <Formik
        initialValues={{ question: '', answer: '', id: '' }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          parentProps.setValues({
            ...parentProps?.values,
            faqs: [
              ...parentProps?.values?.faqs,
              { ...values, id: generateRandom() },
            ],
          });
          setShowFaqInputs(false);
          resetForm();
        }}
        validationSchema={Schema}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                {' '}
                <Typography className="faq-text">
                  Frequently Asked Questions
                </Typography>
              </Box>
              <Box>
                <Button onClick={handleAddFaq} className="faq-button">
                  <AddIcon
                    className="faq-button"
                  />
                  Add FAQ
                </Button>
              </Box>
            </Box>

            {showFaqInputs ? (
              <Box>
                <Stack direction={'column'} my={'1rem'} gap={2}>
                  <TextField
                    id="outlined-basic"
                    label="Add a Question"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter Question"
                    value={props?.values?.question}
                    onChange={props?.handleChange}
                    onBlur={props?.handleBlur}
                    name="question"
                    error={
                      props?.touched?.question &&
                      Boolean(props?.errors?.question)
                    }
                    required
                  />
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Add a Answer"
                    multiline
                    rows={4}
                    value={props?.values?.answer}
                    onChange={props?.handleChange}
                    onBlur={props?.handleBlur}
                    name="answer"
                    error={
                      props?.touched?.answer && Boolean(props?.errors?.answer)
                    }
                  />
                  <Stack direction={'row'} gap={2} justifyContent={'flex-end'}>
                    <Button
                      className="containedPrimaryWhite"
                      variant="contained"
                      size="small"
                      sx={{ width: 'auto !important' }}
                      onClick={() => {
                        setShowFaqInputs(false, props?.resetForm());
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      className="containedPrimary"
                      size="small"
                      onClick={props.handleSubmit}
                    >
                      Add
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ) : (
              ''
            )}
          </form>
        )}
      </Formik>

      {parentProps?.values &&
        parentProps?.values?.faqs &&
        parentProps?.values?.faqs?.length ? (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box></Box>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <div
                  style={{ listStyleType: 'none' }}
                  className="characters"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {parentProps?.values?.faqs?.map((item, index) => {
                    return (
                      <Draggable
                        style={{ padding: '500px' }}
                        key={item?.id}
                        draggableId={item?.id}
                        index={index}
                      >
                        {renderDraggable((provided) => (
                          <p
                            style={{ listStyleType: 'none !important' }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <AccordionFaq
                              item={item}
                              index={index}
                              parentProps={parentProps}
                            />
                          </p>
                        ))}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>
      ) : (
        ''
      )}
    </>
  );
};

export const Schema = Yup.object().shape({
  question: Yup.string().max(255).required('Question is required field'),
  answer: Yup.string().max(255).required('Answer is required field'),
});

export default Faqs;
