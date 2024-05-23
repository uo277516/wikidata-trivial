import React, { useEffect, useState } from 'react';
import {Table, Switch, Segmented, Space} from 'antd'; 
import moment from 'moment';


const TableComponent = (props) => {
    const [myClasification, setMyClasification] = useState(false);

    const {streaks } = props;
    const dataStreaks = 
    streaks.map(item => ({
      racha: item.streak,
      categoria: item.category,
      fecha: moment(item.date).format('DD/MM/YYYY')
    }));
    const columns = [
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

    return (
        <div>
            <Space>
                <Switch
                    checked={myClasification}
                    onChange={() => setMyClasification(!myClasification)}
                    checkedChildren="Mis resultados"
                    unCheckedChildren="Resultados generales"
                    style= {{marginBottom:'1em', marginTop:'1em'}}
                />
                <Segmented
                    value={3}
                    // onChange={(value: number) => setCount(value)}
                    options={[
                    {
                        label: 'Hoy',
                        value: 0,
                    },
                    {
                        label: 'Última semana',
                        value: 4,
                    },
                    {
                        label: 'Este mes',
                        value: 3,
                    },
                    {
                        label: 'Completa',
                        value: 6,
                    },
                    ]}
                    style={{marginLeft:'1em'}}
                />
                
            </Space>
            <Table columns={columns} dataSource={dataStreaks} style={{marginTop:'1em'}}/>
        </div>
    );
};

export default TableComponent;
