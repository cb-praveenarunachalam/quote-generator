import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import './quote-requirement.css';
import generatorService from '../services/generator-service';
import { useNavigate } from 'react-router';

function QuoteRequirement() {
  const formInitialState = {
    prompt: '',
    contractStartDate: '',
    contractEndDate: ''
  };

  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({...formInitialState});

  const handleFormChange = (eventObject: any) => {
    setFormValues({
      ...formValues,
      [eventObject.target.name]: eventObject.target.value
    })
  };

  const handleFormSubmit = async (eventObject: any) => {
    eventObject.preventDefault();
    const response = await generatorService.postRequirement({
      ...formValues,
      contractStartDate: convertDateToTimestamp(formValues.contractStartDate),
      contractEndDate: convertDateToTimestamp(formValues.contractEndDate)
    });

    if (!response.status) {
      navigate('/create-quote', { state: {quote: response} });
    }
  };

  const convertDateToTimestamp = (dateAsString: string): number => {
    return Math.floor(new Date(dateAsString).getTime() / 1000)
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
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contract start date</Form.Label>
                <Form.Control type='date' name='contractStartDate' value={formValues.contractStartDate} onChange={handleFormChange} />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contract end date</Form.Label>
                <Form.Control type='date' name='contractEndDate' value={formValues.contractEndDate} onChange={handleFormChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="prompt">
                <Form.Label>Requirements</Form.Label>
                <Form.Control as="textarea" rows={3} name='prompt' onChange={handleFormChange} value={formValues.prompt} placeholder='Enter the requirements for the subscription' />
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
