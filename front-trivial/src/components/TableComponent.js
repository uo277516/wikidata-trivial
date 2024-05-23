import React, { useState, useEffect } from 'react';
import { Table, Switch, Segmented, Space } from 'antd';
import moment from 'moment';
import axios from 'axios'; 
const TableComponent = (props) => {
    let {user} = props;
    const [myClasification, setMyClasification] = useState(false);
    const [streaks, setStreaks] = useState([]);
    const [filteredStreaks, setFilteredStreaks] = useState([]);
    const [filteredOption, setFilteredOption] = useState(0); // Opción predeterminada

    useEffect(() => {
        fetchStreaks();
    }, []);

    useEffect(() => {
        filterStreaks();
    }, [streaks, myClasification, filteredOption]);

    const fetchStreaks = async () => {
        try {
            const response = await axios.get('http://localhost:3001/getAllStreaks');
            setStreaks(response.data);
        } catch (error) {
            console.error('Error fetching streaks:', error);
        }
    };

    const filterStreaks = () => {
        let filteredData = [...streaks];

        //Filtrar por clasificación del usuario si está habilitado
        if (myClasification) {
            const currentUser = user._json.username; 
            filteredData = filteredData.filter(item => item.username === currentUser);
        }

        //Aplicar filtro del segmented
        switch (filteredOption) {
            case 0: //Hoy
                filteredData = filteredData.filter(item => moment(item.date).isSame(moment(), 'day'));
                break;
            case 1: //Última semana
                filteredData = filteredData.filter(item => moment(item.date).isSame(moment(), 'week'));
                break;
            case 2: //Este mes
                filteredData = filteredData.filter(item => moment(item.date).isSame(moment(), 'month'));
                break;
            default: 
                break;
        }

        setFilteredStreaks(filteredData);
    };

    const handleSegmentedChange = (value) => {
        setFilteredOption(value);
    };

    let columns = [
        {
            title: 'Nombre de usuario',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'Preguntas',
            dataIndex: 'racha',
            key: 'racha',
            sorter: (a, b) => a.racha - b.racha
        },
        {
            title: 'Categoría',
            dataIndex: 'categoria',
            key: 'categoria',
            filters: [
                {
                    text: 'deporte',
                    value: 'deporte',
                },
                {
                    text: 'música',
                    value: 'música',
                },
                {
                    text: 'investigación',
                    value: 'investigación',
                },
            ],
            onFilter: (value, record) => record.categoria.indexOf(value) === 0,
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
            sorter: (a, b) => moment(a.fecha, 'DD/MM/YYYY').unix() - moment(b.fecha, 'DD/MM/YYYY').unix(),
        }
    ];

    let dataStreaks = filteredStreaks.map(item => ({
        username: item.username,
        racha: item.streak,
        categoria: item.category,
        fecha: moment(item.date).format('DD/MM/YYYY')
    }));


    //Añadir columna si clasificaciones usuario
    if (myClasification) {
        columns = columns.slice(1);

        dataStreaks = filteredStreaks.map(item => ({
            racha: item.streak,
            categoria: item.category,
            fecha: moment(item.date).format('DD/MM/YYYY')
        }));
    }


    return (
        <div>
            <Space>
                <Switch
                    checked={myClasification}
                    onChange={() => setMyClasification(!myClasification)}
                    checkedChildren="Resultados generales"
                    unCheckedChildren="Mis resultados"
                    style={{ marginBottom: '1em', marginTop: '1em', width:'11em'}}
                />
                <Segmented
                    value={filteredOption}
                    onChange={handleSegmentedChange}
                    options={[
                        {
                            label: 'Hoy',
                            value: 0,
                        },
                        {
                            label: 'Esta semana',
                            value: 1,
                        },
                        {
                            label: 'Este mes',
                            value: 2,
                        },
                        {
                            label: 'Completa',
                            value: 3,
                        },
                    ]}
                    style={{ marginLeft: '0.3em' }}
                />

            </Space>
            <Table size='large' columns={columns} dataSource={dataStreaks} style={{ marginTop: '1em' }} />
        </div>
    );
};

export default TableComponent;
