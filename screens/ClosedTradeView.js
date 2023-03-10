import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import React, {useFocusEffect, useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {FlashList} from '@shopify/flash-list';
import {useIsFocused} from '@react-navigation/native';

let db = openDatabase({name: 'AdvancedJournal.db'});

const ClosedTradeView = ({navigation, route}) => {
  const {navigatedDataClose} = route.params;
  const [customData, setCustomData] = useState([]);
  const [rowDeletedSucessfully, setRowDeletedSucessfully] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('page refreshed');
    const headerArray = [
      'Final_PnL',
      'All_Open_Charges',
      'All_Close_Charges',
      'Action',
      'Category',
      'Date',
      'Day',
      'Deployed_Capital',
      'Instrument',
      'Name',
      'Reason_Of_Trade',
      'Strategy_Name',
      'Time',
      'Timeframe',
      'Trade_Type',
      'CloseDate',
      'CloseTime',
      'CloseDay',
    ];
    for (let i = 0; i < headerArray.length; i++) {
      navigatedDataClose.push(headerArray[i]);
    }

    const selectCols = navigatedDataClose.join(', ');

    const selectQuery = `SELECT ${selectCols} FROM table_journalEntryWithExit`;
    db.transaction(txn => {
      txn.executeSql(selectQuery, [], (tx, res) => {
        var fetchedData = [];
        for (let i = 0; i < res.rows.length; ++i) {
          fetchedData.push(res.rows.item(i));
        }
        setCustomData(fetchedData);
      });
    });
  }, [isFocused, rowDeletedSucessfully]);

  // This is type 1 simple Alert to take confirmation from user with yes or no press.
  const deleteAlert = item => {
    Alert.alert(
      'Warning!',
      'You are about to delete this Journal Entry Permanently',
      [
        {text: 'Yes', onPress: () => deleteRows(item)},
        {text: 'No', onPress: () => null},
      ],
    );
  };

  const deleteRows = item => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM table_journalEntryWithExit WHERE Time = ?',
        [item.Time],
        (tx, results) => {
          if (results.rowsAffected == 1) {
            setRowDeletedSucessfully(!rowDeletedSucessfully);
            showMessage({
              message: 'Trade Deleted Successfully',
              type: 'default',
              backgroundColor: '#90ee90',
            });
          }
        },
        error => {
          showMessage({
            message: 'Unable to delete',
            error,
            type: 'danger',
          });
        },
      );
    });
  };

  return customData.length > 0 ? (
    <View
      style={{
        flex: 1,
        backgroundColor: '#343534',
        borderBottomColor: '#fff',
        borderBottomWidth: 5,
      }}>
      <View
        style={{
          backgroundColor: '#ffff',
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: '700',
            color: '#010203',
            marginVertical: 2,
            marginHorizontal: 1,
            fontSize: 20,
          }}>
          Opened Trades
        </Text>
      </View>
      <FlashList
        data={customData}
        estimatedItemSize={200}
        renderItem={({item, index}) => {
          return (
            <Pressable style={styles.card}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <View style={{flex: 2}}>
                  <Text style={styles.headerName}>
                    {item.Instrument + '#' + item.Name + '-' + item.Category}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      ...styles.headerAction,
                      color: item.Action == 'SHORT' ? '#ff0000' : '#00ffff',
                    }}>
                    {item.Action}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#7f7f7f',
                  paddingVertical: 10,
                  borderBottomColor: '#fff',
                  borderBottomWidth: 1,
                  marginHorizontal: 2,
                }}>
                <Text style={styles.headerDatetime}>{'Open:' + item.Date}</Text>
                <Text style={styles.headerDatetime}>
                  {'Close:' + item.CloseDate}
                </Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  backgroundColor: '#585858',
                  paddingVertical: 5,
                  bottom: 5,
                }}>
                <View
                  style={{
                    backgroundColor: '#343534',
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                  }}>
                  <Text style={{...styles.headerData, fontSize: 23}}>
                    Chart : {item.Timeframe} - {item.Trade_Type}
                  </Text>
                  <Text style={{...styles.headerData, fontSize: 20}}>
                    Strategy Used : {item.Strategy_Name}
                  </Text>
                  <Text style={{...styles.headerData, fontSize: 15}}>
                    Trade Logic : {item.Reason_Of_Trade}
                  </Text>
                </View>
              </View>
              <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginHorizontal:10,flexWrap:'wrap',borderBottomColor:'#010203',borderBottomWidth:1}}>
              <Text style={{color: '#ffffbf', fontSize: 18}}>
                {'Result: '}
                <Text
                  style={[
                    item.Final_PnL < 0 ? styles.redText : styles.greenText,
                  ]}>
                  {item.Final_PnL}
                </Text>
                <Text
                  style={[
                    item.Final_PnL < 0 ? styles.redText : styles.greenText,
                  ]}>
                  {item.Final_PnL < 0 ? '(Loss)' : '(Gain)'}
                </Text>
              </Text>
              <Text style={{color: '#ffffbf', fontSize: 18}}>
                {'Other Charges: ' +
                  (parseInt(item.All_Open_Charges)+ (parseInt(item.All_Close_Charges))
                    )}
              </Text>
              </View>
              
              <View>
                {Object.keys(item)
                  .filter(
                    key =>
                      ![
                        'Final_PnL',
                        
                        'Action',
                        'Category',
                        'Date',
                        'Time',
                        'Day',
                        'Timeframe',
                        'Trade_Type',
                        'Deployed_Capital',
                        'Instrument',
                        'Name',
                        'Reason_Of_Trade',
                        'Strategy_Name',
                        'CloseDate',
                        'CloseTime',
                        'CloseDay',
                      ].includes(key),
                  )
                  .sort()
                  .map(key => (
                    <Text key={key} style={styles.list}>
                      {key}: {item[key]}
                    </Text>
                  ))}
                <Text style={styles.footer}>
                  {'Deployed Capital:' + item.Deployed_Capital}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignSelf: 'center',
                }}>
                <Pressable
                  onPress={() => deleteAlert(item)}
                  style={styles.Button}>
                  <Text style={{color: '#fdfff5'}}>Delete</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  ) : (
    <>
      <View style={{backgroundColor: '#ffff'}}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: '700',
            color: '#010203',
            marginVertical: 10,
            fontSize: 20,
          }}>
          Closed Trades
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#343534',
          borderBottomColor: '#fff',
          borderBottomWidth: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#9370db', fontSize: 70, textAlign: 'center'}}>
          Sorry! No records to show here
        </Text>
      </View>
    </>
  );
};

export default ClosedTradeView;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderBottomColor: '#ff6943',
    borderBottomWidth: 2,
    marginBottom: 1,
    backgroundColor: '#585858',
    borderRadius: 10,
  },
  list: {
    borderBottomColor: '#7f7f7f',
    borderBottomWidth: 1,
    color: '#d3d3d3',
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  footer: {
    color: '#ff6943',
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    borderBottomColor: '#7f7f7f',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  headerData: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    paddingVertical: 5,
    fontSize: 18,
  },
  headerDatetime: {
    color: '#fff',
    marginHorizontal: 5,
    fontSize: 16,
    textAlign: 'center',
  },
  headerAction: {
    color: '#fdfff5',
    marginHorizontal: 5,
    fontSize: 19,
    textAlign: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    marginVertical: 5,
  },
  headerName: {
    color: '#fdfff5',
    marginHorizontal: 5,
    fontSize: 18,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    marginVertical: 5,
  },
  Button: {
    flex: 2,
    maxWidth: 80,
    backgroundColor: '#343534',
    marginVertical: 5,
    padding: 5,
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fdfff5',
  },
  redText: {
    color: '#ff0000',
    fontSize: 18,
    
  },
  greenText: {
    color: '#0ff',
    fontSize: 18,
  },
});
