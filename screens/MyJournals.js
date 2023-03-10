import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from '../src/commonWidgets/BackButton';
import {
  MultipleSelectList,
  SelectList,
} from 'react-native-dropdown-select-list';
import {openDatabase} from 'react-native-sqlite-storage';

let db = openDatabase({name: 'AdvancedJournal.db'});

const MyJournals = ({navigation}) => {
  const [selected, setSelected] = useState('');
  const [selected1, setSelected1] = useState('');
  const [customListVisible, setCustomListVisible] = useState(false);
  const [updateCustomListVisible, setUpdateCustomListVisible] = useState(false);
  const [navigatedDataOpen, setNavigatedDataOpen] = useState('');
  const [navigatedDataClose, setNavigatedDataClose] = useState('');
  const [savedOpenCustomSettingsState, setSavedOpenCustomSettingsState] =
    useState(false);
  const [savedClosedCustomSettingsState, setSavedClosedCustomSettingsState] =
    useState(false);

  const data = [
    {key: '1', value: 'Open Trades'},
    {key: '2', value: 'Closed Trades'},
  ];

  const CustomListDataOpenTrades = [
    
    {key: 'Quantity', value: 'Quantity/Lot Size'},
    {key: 'Lots', value: 'Lots'},
    {key: 'Stoploss', value: 'Stoploss'},
    {key: 'Trailing_SL', value: 'TrailingSL'},
    {key: 'Risked_Amount', value: 'Risked Amount'},
    {key: 'Risk_Percentage', value: 'Risk Percentage'},
    {key: 'Trailing_Risk', value: 'Trailed Risk'},
    {key: 'Target1', value: 'Target1'},
    {key: 'Target2', value: 'Target2'},
    {key: 'Target3', value: 'Target3'},
  ];
  const CustomListDataClosedTrades = [
    {key: 'Entry', value: 'Entry'},
    {key: 'Quantity', value: 'Quantity/Lot Size'},
    {key: 'Lots', value: 'Lots'},
    {key: 'Stoploss', value: 'Stoploss'},
    {key: 'Trailing_SL', value: 'TrailingSL'},
    {key: 'Risked_Amount', value: 'Risked Amount'},
    {key: 'Risk_Percentage', value: 'Risk Percentage'},
    {key: 'Trailing_Risk', value: 'Trailed Risk'},
    {key: 'Target1', value: 'Target1'},
    {key: 'Target2', value: 'Target2'},
    {key: 'Target3', value: 'Target3'},
    {key: 'Exit', value: 'Exit'},
  ];

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_saveOpenCustomSettings'",
        [],
        (tx, res) => {
          // txn.executeSql('DROP TABLE IF EXISTS table_saveOpenCustomSettings'),[],(tx, res)=>{
          //   if(res.rowsAffected==1)
          //   console.log('table-customSettings Deleted Succesfully')
          // }
          // console.log('item:', res.rows.length);
          if (res.rows.length > 0) {
            console.log('Table already created');

            setUpdateCustomListVisible(false);
          }
        },
      );
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_saveCloseCustomSettings'",
        [],
        (tx, res) => {
          // txn.executeSql('DROP TABLE IF EXISTS table_saveCloseCustomSettings'),[],(tx, res)=>{
          //   if(res.rowsAffected==1)
          //   console.log('table-customSettings Deleted Succesfully')
          // }
          // console.log('item:', res.rows.length);
          if (res.rows.length > 0) {
            console.log('Table already created');

            setUpdateCustomListVisible(false);
          }
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_saveOpenCustomSettings',
        [],
        (tx, res) => {
          console.log(res.rows.length + 'table selected');
          if (res.rows.length > 0) {
            setSavedOpenCustomSettingsState(true);
          } else {
            setSavedOpenCustomSettingsState(false);
          }
        },
      );
      txn.executeSql(
        'SELECT * FROM table_saveCloseCustomSettings',
        [],
        (tx, res) => {
          console.log(res.rows.length + 'table selected');
          if (res.rows.length > 0) {
            setSavedClosedCustomSettingsState(true);
          } else {
            setSavedClosedCustomSettingsState(false);
          }
        },
      );
    });
  }, [selected]);

  useEffect(() => {
    if (navigatedDataOpen) {
      navigation.navigate('JournalsCustomView', {navigatedDataOpen});
    }
  }, [navigatedDataOpen]);
  useEffect(() => {
    if (navigatedDataClose) {
      navigation.navigate('ClosedTradeView', {navigatedDataClose});
    }
  }, [navigatedDataClose]);

  const saveSettingsOpen = () => {
    console.log(selected1 + 'data before setup');
    const dataString = JSON.stringify(selected1);
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO table_saveOpenCustomSettings(data) VALUES (?)',
        [dataString],
        (tx, res) => {
          if (res.rowsAffected == 1) {
            console.log('Table-saveOpenCustomSettings Updated Successfully');
            console.log(res.rows.length);
            alert('Custom settings saved succesfully for open trades');
            setNavigatedDataOpen(selected1);
            setSelected1('');
            setSelected('');
          }
        },
      );
    });
  };
  const saveSettingsClose = () => {
    console.log(selected1 + 'data before setup');
    const dataString = JSON.stringify(selected1);
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO table_saveCloseCustomSettings(data) VALUES (?)',
        [dataString],
        (tx, res) => {
          if (res.rowsAffected == 1) {
            console.log('Table-saveCloseCustomSettings Updated Successfully');
            console.log(res.rows.length);
            alert('Custom settings saved succesfully for closed trades');
            setNavigatedDataClose(selected1);
            setSelected1('');
            setSelected('');
          }
        },
      );
    });
  };

  const proceedWithSavedSettingsOpen = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_saveOpenCustomSettings',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            const data = JSON.parse(result.rows.item(0).data);
            // Do something with the retrieved data
            setNavigatedDataOpen(data);
            console.log('data added to setnavdata succesfully');
            navigation.navigate('JournalsCustomView', {navigatedDataOpen});
          } else {
            console.log('No data found');
          }
        },
        (_, error) => {
          console.log('Error while retrieving data', error);
        },
      );
    });
  };
  const proceedWithSavedSettingsClose = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_saveCloseCustomSettings',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            const data = JSON.parse(result.rows.item(0).data);
            // Do something with the retrieved data
            setNavigatedDataClose(data);
            console.log('data added to setnavdata succesfully');
            navigation.navigate('ClosedTradeView', {navigatedDataClose});
          } else {
            console.log('No data found');
          }
        },
        (_, error) => {
          console.log('Error while retrieving data', error);
        },
      );
    });
  };

  const updateSettingsOpen = () => {
    console.log(selected1 + 'data before setup');
    const dataString = JSON.stringify(selected1);
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE table_saveOpenCustomSettings SET data = ?',
        [dataString],
        (tx, res) => {
          console.log(res.rows.length);
          if (res.rowsAffected == 1) {
            console.log('Table-saveOpenCustomSettings Updated Successfully');
            console.log(res.rows.length);
            alert('Settings updated succesfully for open trades');
            setUpdateCustomListVisible(false)
            setNavigatedDataOpen(selected1);
            setSelected1('');
            setSelected('');
          }
        },
      );
    });
  };

  const updateSettingsClose = () => {
    console.log(selected1 + 'data before setup');
    const dataString = JSON.stringify(selected1);
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE table_saveCloseCustomSettings SET data = ?',
        [dataString],
        (tx, res) => {
          console.log(res.rows.length);
          if (res.rowsAffected == 1) {
            console.log('Table-saveCloseCustomSettings Updated Successfully');
            console.log(res.rows.length);
            alert('Settings updated updated successfully for closed trades');
            setUpdateCustomListVisible(false)
            setNavigatedDataClose(selected1);
            setSelected1('');
            setSelected('');
          }
        },
      );
    });
  };

  return (
    <ScrollView backgroundColor={`#fff`}>
      <View>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
      <View>
        <SelectList
          setSelected={val => setSelected(val)}
          data={data}
          save="value"
          placeholder="Please Select Types"
          search={false}
          boxStyles={{borderColor: 'black', margin: 3}}
          maxHeight={100}
        />
      </View>
      {selected == 'Open Trades' ? (
        savedOpenCustomSettingsState ? (
          // proceed with saved settings and update settings ui for open trades
          <>
          <View style={styles.btnContainer}>
              <Pressable
              onPress={()=>{proceedWithSavedSettingsOpen()}}
                style={styles.btnTouchable}>
                <Text style={styles.textStyle}>Proceed with saved settings</Text>
              </Pressable>
              </View>
              <View style={styles.btnContainer}>
              <Pressable
              onPress={()=>{setUpdateCustomListVisible(!updateCustomListVisible)}}
                style={styles.btnTouchable}>
                <Text style={styles.textStyle}>Update custom settings</Text>
              </Pressable>
              </View>
              {updateCustomListVisible&&(
                <View style={{alignItems:'center',marginVertical:10}}>
                <MultipleSelectList 
                data={CustomListDataOpenTrades}
                save="key"
                setSelected={val => setSelected1(val)}
                placeholder="Select whatever you want to view from list"
                />
                <Pressable
                onPress={()=>updateSettingsOpen()}
                  style={styles.btnTouchable}>
                  <Text style={styles.textStyle}>Update</Text>
                </Pressable>
              </View>
              )}
              </>
        ) : (
          //create custom settings UI for open trades
          <View>
            <View style={styles.btnContainer}>
              <Pressable
                style={styles.btnTouchable}
                onPress={() => {
                  setCustomListVisible(!customListVisible);
                }}>
                <Text style={styles.textStyle}>Create View</Text>
              </Pressable>
            </View>
            {customListVisible&&(
              <View style={{alignItems:'center',marginVertical:10}}>
              <MultipleSelectList 
              data={CustomListDataOpenTrades}
              save="key"
              setSelected={val => setSelected1(val)}
              placeholder="Select whatever you want to view from list"
              />
              <Pressable
              onPress={()=>saveSettingsOpen()}
                style={styles.btnTouchable}>
                <Text style={styles.textStyle}>Save and submit</Text>
              </Pressable>
            </View>
            )}
          </View>
        )
      ) : selected == 'Closed Trades' ? (
        savedClosedCustomSettingsState ? (
            //proceed with saved settings and update settings ui for closed trades
          <>
          <View style={styles.btnContainer}>
              <Pressable
              onPress={()=>{proceedWithSavedSettingsClose()}}
                style={styles.btnTouchable}>
                <Text style={styles.textStyle}>Proceed with saved settings</Text>
              </Pressable>
              </View>
              <View style={styles.btnContainer}>
              <Pressable
              onPress={()=>{setUpdateCustomListVisible(!updateCustomListVisible)}}
                style={styles.btnTouchable}>
                <Text style={styles.textStyle}>Update custom settings</Text>
              </Pressable>
              </View>
              {updateCustomListVisible&&(
                <View style={{alignItems:'center',marginVertical:10}}>
                <MultipleSelectList 
              data={CustomListDataClosedTrades}
              save="key"
              setSelected={val => setSelected1(val)}
              placeholder="Select whatever you want to view from list"
              />
                <Pressable
                onPress={()=>updateSettingsClose()}
                  style={styles.btnTouchable}>
                  <Text style={styles.textStyle}>Update</Text>
                </Pressable>
              </View>
              )}
              </>
        ) : (
          //create custom settings UI for close trades
          <View>
            <View style={styles.btnContainer}>
              <Pressable
                style={styles.btnTouchable}
                onPress={() => {
                  setCustomListVisible(!customListVisible);
                }}>
                <Text style={styles.textStyle}>Create View</Text>
              </Pressable>
            </View>
            {customListVisible&&(
              <View style={{alignItems:'center',marginVertical:10}}>
              <MultipleSelectList 
              data={CustomListDataClosedTrades}
              save="key"
              setSelected={val => setSelected1(val)}
              placeholder="Select whatever you want to view from list"
              />
              <Pressable
                onPress={()=>saveSettingsClose()}
                style={styles.btnTouchable}>
                <Text style={styles.textStyle}>Save and submit</Text>
              </Pressable>
            </View>
            )}
          </View>
        )
      ) : null}
    </ScrollView>
  );
};

export default MyJournals;

const styles = StyleSheet.create({
  btnContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  btnTouchable: {
    backgroundColor: '#696969',
    width: '80%',
    height: 60,
    borderRadius: 20,
  },
  textStyle: {
    color: '#fffaf0',
    textAlign: 'center',
    fontSize: 20,
    top: 15,
    fontFamily: 'Ariel-Sans',
  },
});
