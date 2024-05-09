import React from 'react';
import {Card, Flex, Typography } from 'antd';
import vars from '../vars';
import { getSitelinkUrl } from 'wikibase-sdk'

const {Title, Paragraph, Link} = Typography;


let QuestionCard = (props) => {

    let {imagenUrl, questionSelected, entity} = props;

    const cardStyle = {
    maxWidth: '100%', 
    width: '1100px', //ns cual poner
  };

  const imgStyle = {
    display: 'block',
    maxWidth: '100%', 
    height: '100%',
    overflow: 'hidden',
    //height: 'auto', //esto ns si comentarlo o no
  };

 

    const error_url = vars.fallback;
      
    const url = getSitelinkUrl({ site: 'wikidata', title: entity });

    return (
    <>
        <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
            <Flex>
                <div>
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
                </div>
                <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
                    <Title level={3} style={{ fontSize: '20px', marginBottom: '25px', marginTop: '50px' }}>
                        {questionSelected}
                    </Title>
                    <Paragraph>
                        Para más información, puede consultar su entrada en Wikidata en este 
                        <Link href={url} target="_blank" style={{fontSize:"20px"}}> link. </Link>
                    </Paragraph>
                </Flex>
            </Flex>
        </Card>

    </>
    );
};

export default QuestionCard;