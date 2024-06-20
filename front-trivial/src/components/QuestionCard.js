import React from 'react';
import {Card, Flex, Typography } from 'antd';
import vars from '../vars';
import { getSitelinkUrl } from 'wikibase-sdk';
import { useTranslation } from 'react-i18next';


const {Title, Paragraph, Link} = Typography;


/**
 * QuestionCard component to display a question with its image and related information.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.imagenUrl - URL of the image.
 * @param {string} props.questionSelected - The selected question.
 * @param {string} props.entity - The Wikidata entity of the question.
 * @param {string} props.label - The label for the question.
 * @param {string} props.relationSelected - The selected relation (Wikidata property).
 * @returns {React.JSX.Element} Rendered component.
 */
let QuestionCard = (props) => {

    let {imagenUrl, questionSelected, entity, label, relationSelected} = props;

    const cardStyle = {
        maxWidth: '100%', 
        width: '80vw',
        height: '40vh'
    };

    const imgStyle = {
        width: '30vw',
        height:' 40vh',
        objectFit:'cover'
    };

    const { t } = useTranslation();
    const error_url = vars.fallback;
    const url = getSitelinkUrl({ site: 'wikidata', title: entity });

    return (
    <>
        <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
            <Flex>
                <div>
                    {imagenUrl ? (
                    <img
                        alt={t('card.image')}
                        width={200}
                        src={imagenUrl}
                        style={imgStyle}
                    />
                    ) : (
                    <img
                        alt={t('card.noImage')}
                        width={200}
                        src={error_url} 
                        style={imgStyle}
                    />
                    )}
                </div>
                <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
                    <Title level={3} style={{ fontSize: '20px', marginBottom: '25px', marginTop: '50px' }}>
                        {t(relationSelected, {label})}
                    </Title>
                    <Paragraph>
                        {t('card.info')}
                        <Link href={url} target="_blank" style={{fontSize:"18px"}}> {t('card.link')} </Link>
                    </Paragraph>
                </Flex>
            </Flex>
        </Card>
    </>
    );
};

export default QuestionCard;