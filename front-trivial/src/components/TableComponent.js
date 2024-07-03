import React, { useState, useEffect } from 'react';
import { Table, Switch, Segmented, Space, notification } from 'antd';
import moment from 'moment';
import axios from 'axios'; 
import { useTranslation } from 'react-i18next';
import '../styles/styles.css'; 


/**
 * TableComponent. Displays a table with streak data that can be filtered and sorted.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.user - User information.
 * @returns {React.JSX.Element} Rendered component.
 */
const TableComponent = (props) => {
    let {user} = props;
    const [myClasification, setMyClasification] = useState(false);
    const [streaks, setStreaks] = useState([]);
    const [filteredStreaks, setFilteredStreaks] = useState([]);
    const [filteredOption, setFilteredOption] = useState(0); 
    const { t } = useTranslation();
    
    /**
    * Lifecycle hook for fetching streaks on component mount.
    * @function useEffect
    * @returns {void}
    */
    useEffect(() => {
        fetchStreaks();
    }, []);

    /**
    * Lifecycle hook for filtering streaks when streaks, my clasification of filtered option change.
    * @function useEffect
    * @returns {void}
    */
    useEffect(() => {
        filterStreaks();
    }, [streaks, myClasification, filteredOption]);

    /**
     * Fetches streak data from the backend.
     * @function fetchStreaks
     * @async
     * @returns {Promise<Void>}
     */
    const fetchStreaks = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_BACKEND_BASE_URL +'/getAllStreaks');
            setStreaks(response.data);
        } catch (error) {
            notification.error({message: t('table.error'), description: t('table.errorDesc'), placement: 'top'});
            console.error('Error fetching streaks:', error);
        }
    };

    /**
     * Filters streak data based on user classification and selected filter option.
     * @function filterStreaks
     * @returns {void}
     */
    const filterStreaks = () => {
        let filteredData = [...streaks];

        //filter by user classification if enabled
        if (myClasification) {
            const currentUser = user._json.username; 
            filteredData = filteredData.filter(item => item.username === currentUser);
        }

        //apply filter from segmented control
        switch (filteredOption) {
            case 0: //today
                filteredData = filteredData.filter(item => moment(item.date).isSame(moment(), 'day'));
                break;
            case 1: //last week
                filteredData = filteredData.filter(item => moment(item.date).isSame(moment(), 'week'));
                break;
            case 2: //this month
                filteredData = filteredData.filter(item => moment(item.date).isSame(moment(), 'month'));
                break;
            default: //all
                break;
        }

        setFilteredStreaks(filteredData);
    };

    /**
     * Handles changes in the segmented control.
     * @function handleSegmentedChange
     * @param {number} value - The selected filter option.
     * @returns {void}
     */
    const handleSegmentedChange = (value) => {
        setFilteredOption(value);
    };


    //columns of the table
    let columns = [
        {
            title: t('table.username'),
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: t('table.questions'),
            dataIndex: 'racha',
            key: 'racha',
            sorter: (a, b) => a.racha - b.racha
        },
        {
            title: t('table.category'),
            dataIndex: 'categoria',
            key: 'categoria',
            filters: [
                {
                    text: t('table.deporte'),
                    value: t('table.deporte'),
                },
                {
                    text: t('table.música'),
                    value: t('table.música'),
                },
                {
                    text: t('table.investigación'),
                    value: t('table.investigación'),
                },
            ],
            onFilter: (value, record) => record.categoria.indexOf(value) === 0,
        },
        {
            title: t('table.date'),
            dataIndex: 'fecha',
            key: 'fecha',
            sorter: (a, b) => moment(a.fecha, 'DD/MM/YYYY').unix() - moment(b.fecha, 'DD/MM/YYYY').unix(),
        }
    ];

    //filter streaks to show only the data required and format data
    let dataStreaks = filteredStreaks.map(item => ({
        key: item.id,
        username: item.username,
        racha: item.streak,
        categoria: t(`table.${item.category}`),
        fecha: moment(item.date).format('DD/MM/YYYY')
    }));


    //add or remove columns is user classification is enabled or not
    if (myClasification) {
        columns = columns.slice(1);

        dataStreaks = filteredStreaks.map(item => ({
            key: item.id,
            racha: item.streak,
            categoria: t(`table.${item.category}`),
            fecha: moment(item.date).format('DD/MM/YYYY')
        }));
    }


    return (
        <div>
            <Space>
                <Switch
                    checked={myClasification}
                    onChange={() => setMyClasification(!myClasification)}
                    checkedChildren={t('table.rakings')}
                    unCheckedChildren={t('table.myRanking')}
                    style={{ marginBottom: '1em', marginTop: '1em', width:'11em'}}
                />
                <Segmented
                    value={filteredOption}
                    onChange={handleSegmentedChange}
                    options={[
                        {
                            label: t('table.today'),
                            value: 0,
                        },
                        {
                            label: t('table.week'),
                            value: 1,
                        },
                        {
                            label: t('table.month'),
                            value: 2,
                        },
                        {
                            label: t('table.all'),
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
