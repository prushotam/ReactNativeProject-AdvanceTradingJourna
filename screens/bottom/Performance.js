import {View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryPie,
} from 'victory-native';
import {FlashList} from '@shopify/flash-list';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'AdvancedJournal.db'});

const PerformanceChart1 = ({data}) => {
  const colors = ['#FF5733', '#C70039', '#900C3F', '#581845'];

  return (
    <View>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        Instrument Traded Percentage
      </Text>
      <VictoryPie
        data={data}
        colorScale={colors}
        labels={({datum}) => `${datum.x}\n${Math.round(datum.y)}%`}
      />
    </View>
  );
};

const PerformanceChart2 = ({data}) => {
  const colors = ['#FF5733', '#C70039', '#900C3F', '#581845'];
  return (
    <View>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        Instrument-Wise Performance:
        <Text style={{fontStyle: 'italic', fontSize: 12}}>
          This chart provides insights into your performance across different
          instruments, allowing you to identify which ones you're doing well in
          and which ones you need to focus on improving. By understanding your
          strengths and weaknesses across various instruments, you can optimize
          your trading strategy to maximize your profits.
        </Text>
      </Text>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryBar
          data={data}
          x="Instrument"
          y="AvgFinalPnL"
          colorScale={colors}
          style={{
            data: {
              fill: ({datum}) => (datum.x >= 0 ? colors[0] : colors[3]),
            },
          }}
        />
      </VictoryChart>
    </View>
  );
};
const PerformanceChart3 = ({data}) => {
  const colors = ['#FF5733', '#C70039', '#900C3F', '#581845'];
  return (
    <View>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        Category-Wise Performance:
        <Text style={{fontStyle: 'italic', fontSize: 12}}>
          Analyzing the performance of each category can provide insights into
          which category the trader is performing well in and which category
          needs improvement. This information can be used to make
          better-informed trading decisions in the future.
        </Text>
      </Text>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryBar
          data={data}
          x="Category"
          y="AvgFinalPnL"
          colorScale={colors}
          style={{
            data: {
              fill: ({datum}) => (datum.y >= 0 ? colors[0] : colors[3]),
            },
          }}
        />
      </VictoryChart>
    </View>
  );
};

const PerformanceChart4 = ({data}) => {
  const colors = ['#FF5733', '#C70039', '#900C3F', '#581845'];
  return (
    <View>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        Trade_Type-Wise Performance:
        <Text style={{fontStyle: 'italic', fontSize: 12}}>
          Trade Type Wise Performance can be a useful metric to determine how
          well you are performing in different types of trades, such as intraday
          and positional trades. By analyzing your performance based on trade
          type, you can identify which type of trades you excel at and which
          type of trades you may need to improve upon. This information can help
          you make more informed trading decisions and ultimately increase your
          overall profitability.
        </Text>
      </Text>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryBar
          data={data}
          x="Trade_Type"
          y="AvgFinalPnL"
          colorScale={colors}
          style={{
            data: {
              fill: ({datum}) => (datum.y >= 0 ? colors[0] : colors[3]),
            },
          }}
        />
      </VictoryChart>
    </View>
  );
};
const Performance = ({navigation}) => {

  const [loading, setLoding] = useState(false);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [showModal, setShowModal] = useState(false);

setInterval(() => {
  db.transaction(txn => {
    txn.executeSql(
      'SELECT COUNT(*) as NumTrades FROM table_journalEntryWithExit',
      [],
      (tx, res) => {
        const numTrades = res.rows.item(0).NumTrades;
        console.log(numTrades)
        if (numTrades < 10) {
          setShowModal(true);
        }
      }
        )
  })
}, 2000);
  
  

  const closeModal = useCallback(() => {
    setShowModal(false);
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    setLoding(true)
    setTimeout(() => {
      
    
    db.transaction(txn => {
      
            txn.executeSql(
              'SELECT Instrument, COUNT(*) as TotalTrades FROM table_journalEntryWithExit GROUP BY Instrument',
              [],
              (tx, res) => {
                const rows = res.rows.raw();
                setData1(
                  rows.map(row => ({
                    x: row.Instrument,
                    y: (row.TotalTrades / numTrades) * 100,
                  })),
                );
              },
            );

            txn.executeSql(
              'SELECT Instrument, AVG(Final_PnL) AS AvgFinalPnL FROM table_journalEntryWithExit GROUP BY Instrument',
              [],
              (tx, results) => {
                const len = results.rows.length;
                const rows = [];
                for (let i = 0; i < len; i++) {
                  rows.push(results.rows.item(i));
                }
                setData2(rows);
              },
            );
            txn.executeSql(
              'SELECT Category, AVG(Final_PnL) AS AvgFinalPnL FROM table_journalEntryWithExit GROUP BY Category',
              [],
              (tx, results) => {
                const len = results.rows.length;
                const rows = [];
                for (let i = 0; i < len; i++) {
                  rows.push(results.rows.item(i));
                }
                setData3(rows);
              },
            );
            txn.executeSql(
              'SELECT Trade_Type, AVG(Final_PnL) AS AvgFinalPnL FROM table_journalEntryWithExit GROUP BY Trade_Type',
              [],
              (tx, results) => {
                const len = results.rows.length;
                const rows = [];
                for (let i = 0; i < len; i++) {
                  rows.push(results.rows.item(i));
                }
                setData4(rows);
              },
            );
            setLoding(false)
          
        
      
    });
  }, 1000);
  }, []);

  const data = [
    {id: 'chart1', data: data1},
    {id: 'chart2', data: data2},
    {id: 'chart3', data: data3},
    {id: 'chart4', data: data4},
  ];

  const renderItem = ({item}) => {
    switch (item.id) {
      case 'chart1':
        return <PerformanceChart1 data={item.data} />;
      case 'chart2':
        return <PerformanceChart2 data={item.data} />;
      case 'chart3':
        return <PerformanceChart3 data={item.data} />;
      case 'chart4':
        return <PerformanceChart4 data={item.data} />;
      default:
        return null;
    }
  };

  return (
    <View style={{backgroundColor: '#ffffbf', flex: 1,}}>
      {showModal?
      <Modal visible={showModal} animationType="slide">
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18}}>
            You need at least 10 closed trades to display performance charts
          </Text>
          <TouchableOpacity
            style={{marginTop: 20, padding: 10, backgroundColor: 'blue'}}
            onPress={closeModal}>
            <Text style={{fontSize: 16, color: 'white'}}>OK</Text>
          </TouchableOpacity>
        </View>
        
      </Modal>
      :
      <>
      <View style={{backgroundColor:'#000040',display:'flex'}}>
      <Text style={{color:'#fff',textAlign:'center',fontSize:20,marginVertical:10}}>Visualize your trade data</Text>
      {loading?
          <ActivityIndicator size={50} color='#fff'></ActivityIndicator>:null

        }
      </View>
      <FlashList
        estimatedItemSize={250}
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
</>
}
    </View>
  );
};

export default Performance;
