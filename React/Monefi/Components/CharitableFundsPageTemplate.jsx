import { React } from "react";
import { Col, Row, Card } from "react-bootstrap";
import CharitableFundsForm from "./CharitableFundsForm";

const CharityFundsPageTemplate = () => {
  return (
    <Card>
      <Card.Body>
        <div className="py-6">
          <Row>
            <Col xl={{ offset: 3, span: 6 }} lg={12} md={12} xs={12}>
              <Card>
                <Card.Body className="p-lg-6">
                  <CharitableFundsForm key="adding-charitablefund" />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CharityFundsPageTemplate;
