import React from 'react';
import {Card, Flex, Typography } from 'antd';
import vars from '../vars';
import { getSitelinkUrl } from 'wikibase-sdk'

const {Title, Paragraph, Link} = Typography;


let QuestionCard = (props) => {
    let {imagenUrl, questionSelected, entity} = props;

    const cardStyle = {
        width: '100%', // Expande la tarjeta para que ocupe todo el ancho disponible
    };

    const imgStyle = {
        width: '100%', // Ancho completo de la imagen
        height: '200px', // Altura fija para crear una imagen cuadrada
        objectFit: 'cover', // Recorta la imagen para que se ajuste al contenedor manteniendo las proporciones
    };

    const error_url = vars.fallback;
      
    const url = getSitelinkUrl({ site: 'wikidata', title: entity });

    return (
        <>
            <Card hoverable style={cardStyle}>
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    {imagenUrl ? (
                        <img
                            alt="Imagen"
                            src={imagenUrl}
                            style={imgStyle}
                        />
                    ) : (
                        <img
                            alt="Imagen no disponible"
                            src={error_url} 
                            style={imgStyle}
                        />
                    )}
                </div>
                <div style={{ padding: '16px' }}>
                    <Title level={3}>{questionSelected}</Title>
                    <Paragraph>
                        Para más información, puede consultar su entrada en Wikidata en este 
                        <Link href={url} target="_blank"> link. </Link>
                    </Paragraph>
                </div>
            </Card>
        </>
    );
};

export default QuestionCard;
