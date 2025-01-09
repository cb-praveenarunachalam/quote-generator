import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './quote-requirement.css';
import generatorService from '../services/generator-service';

function QuoteRequirement() {
  const formInitialState = {
    requirement: ''
  };
  const [formValues, setFormValues] = useState({...formInitialState});

  const handleFormUpdate = (eventObject: any) => {
    setFormValues({
      ...formValues,
      [eventObject.target.name]: eventObject.target.value
    })
  };

  const handleFormSubmit = async (eventObject: any) => {
    eventObject.preventDefault();
    const response = await generatorService.postRequirement(formValues);
    console.log('response', response);
  };

  const handleFormReset = () => {
    setFormValues({...formInitialState});
  };

  return (
    <div className="quote-requirement min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <Container fluid>
        <Row>
          <Col>
            <h3>Smart quote generator</h3>
          </Col>
        </Row>
        <Form className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="requirement">
                <Form.Label>Requirement</Form.Label>
                <Form.Control as="textarea" rows={3} name='requirement' onChange={handleFormUpdate} value={formValues.requirement} />
              </Form.Group>
            </Col>
          </Row>
          <Row className='form-action'>
            <Col>
              <Button variant="default" onClick={handleFormReset}>
                Reset
              </Button>
              <Button variant="primary" className='submit-button' onClick={handleFormSubmit}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}

export default QuoteRequirement;
