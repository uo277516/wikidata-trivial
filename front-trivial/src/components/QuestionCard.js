import React from 'react';
import {Card, Flex, Typography } from 'antd';
import vars from '../vars';

const {Title, Paragraph, Link} = Typography;


let QuestionCard = (props) => {

    let {imagenUrl, questionSelected} = props;

    const cardStyle = {
        width: 900,
        height: 170
    };
    
    const imgStyle = {
        display: 'block'
    };

    const error_url = vars.fallback;
      

    return (
    <>
        <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
            <Flex>
                {imagenUrl ? (
                <img
                    alt="Imagen"
                    width={200}
                    src={imagenUrl}
                    style={imgStyle}
                />
                ) : (
                <img
                    alt="Imagen no disponible"
                    width={200}
                    src={error_url} 
                    style={imgStyle}
                />
                )}
                <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
                <Title level={3} style={{ fontSize: '20px', marginBottom: '25px', marginTop: '50px' }}>
                    {questionSelected}
                </Title>
                <Paragraph>
                    Para más información, puede consultar su entrada en Wikidata en este 
                    <Link href="https://www.wikidata.org/?uselang=es" target="_blank" style={{fontSize:"20px"}}> link. </Link>
                </Paragraph>
                </Flex>
            </Flex>
        </Card>

    </>
    );
};

export default QuestionCard;