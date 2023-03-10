import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Pressable,
  PermissionsAndroid,
  Alert
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx';
import PopupModalExport from '../../src/commonWidgets/PopupModalExport';



let db = openDatabase({name: 'AdvancedJournal.db'});


const Home = ({navigation}) => {
//codes creating 3 tables in Database
useEffect(() => {
  //Table creation Without exit
  db.transaction(txn => {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='table_journalEntryWithoutExit'",
      [],
      (tx, res) => {
        // console.log('item:', res.rows.length);
        if (res.rows.length == 0) {
          //  txn.executeSql('DROP TABLE IF EXISTS table_journalEntry')
          //     console.log('table-journalEntry Deleted Succesfully')
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS table_journalEntryWithoutExit(Time TEXT PRIMARY KEY UNIQUE, Date TEXT, Day TEXT, Instrument TEXT, Category TEXT, Trade_Type TEXT, Timeframe TEXT, Action TEXT, Initial_Capital TEXT, Deployed_Capital TEXT, Name TEXT, Entry TEXT, Quantity TEXT, Lots TEXT, Strategy_Name TEXT, Stoploss TEXT, All_Open_Charges TEXT, Trailing_SL TEXT, Reason_Of_Trade TEXT, Risked_Amount TEXT, Risk_Percentage TEXT, Trailing_Risk TEXT, Target1 TEXT, Target2 TEXT, Target3 TEXT)',
            [],
            console.log('table-journalEntryWithoutExit created successfully'),
          );
          
        } else {
           console.log('Table_journalWithoutExit is already created');
        }
      },
    );
  });
  //Table creation With Exit
  db.transaction(txn => {
    // Extra code to read columns of the table
  //   txn.executeSql(
  //     "SELECT * FROM pragma_table_info('table_journalEntryWithExit')",
  //     [],
  //     (tx, res)=>{
  //         for (let i = 0; i < res.rows.length; i++) {
  //             console.log(res.rows.item(i).name);
  //         }
  //     }
  // )
    txn.executeSql(
      
       //'DROP TABLE IF EXISTS table_journalEntryWithExit',
      // console.log('table deleted withExit'),
  
       "SELECT name FROM sqlite_master WHERE type='table' AND name='table_journalEntryWithExit'",
      [],
      (tx, res) => {
         console.log(res.rows.length)
        if (res.rows.length === 0) {
          txn.executeSql(
             'CREATE TABLE IF NOT EXISTS table_journalEntryWithExit (Id INTEGER PRIMARY KEY AUTOINCREMENT, Time TEXT , Date TEXT, Day TEXT, Instrument TEXT, Category TEXT, Trade_Type TEXT, Timeframe TEXT, Action TEXT, Initial_Capital TEXT, Deployed_Capital TEXT, Name TEXT, Entry TEXT, Quantity TEXT, Lots TEXT, Strategy_Name TEXT, Stoploss TEXT, All_Open_Charges TEXT, Trailing_SL TEXT, Reason_Of_Trade TEXT, Exit TEXT, All_Close_Charges TEXT, Risked_Amount TEXT, Risk_Percentage TEXT, Trailing_Risk TEXT, Target1 TEXT, Target2 TEXT, Target3 TEXT, Lessons TEXT, CloseDate TEXT, CloseTime TEXT, CloseDay TEXT, Final_PnL REAL)',
            [],
            (tx, res) => {
              console.log(
                'table-journalEntryWithExit created successfully',
                res.rows.length,
              );
            },
          );
        } else {
          console.log('tradeWithexit database already created');
        }
      }
    )
    })
    //Creating 3rd Table Savecustom settings
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_saveOpenCustomSettings'",
        [],
        (tx, res) => {
          // txn.executeSql('DROP TABLE IF EXISTS table_saveCustomSettings'),
          // console.log('table-journalEntry Deleted Succesfully')
          // console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_saveOpenCustomSettings(id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)',
              [],
              console.log('table-saveOpenCustomSettings created successfully'),
            );
            
          } else {
            
            console.log('SaveOpenCustomSettings Table already created');
            //This logic is out of my mind that how its working but its waorking as i desired on setting it true so used it
          }
        },
      );
    });

    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_saveCloseCustomSettings'",
        [],
        (tx, res) => {
          // txn.executeSql('DROP TABLE IF EXISTS table_saveCloseCustomSettings'),
          // console.log('table-journalEntry Deleted Succesfully')
          // console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_saveCloseCustomSettings(id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)',
              [],
              console.log('table-saveCloseCustomSettings created successfully'),
            );
            
          } else {
            
            console.log( ' SaveCloseCustomSettings Table already created');
          }
        },
      );
    });
    
}, []);


  let [numberOfOpenedTrades, setNumberOfOpenedTrades] = useState('00');
  let [numberOfClosedTrades, setNumberOfClosedTrades] = useState('00');
  let [navigatedDataClose, setNavigatedDataClose] = useState('');
  let [navigatedDataOpen, setNavigatedDataOpen] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  


  const isFocused = useIsFocused();
  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_journalEntryWithoutExit',
        [],
        (tx, res) => {
          console.log(res.rows.length);
          if (res.rows.length > 0 || res.rows.length ==0) {
            setNumberOfOpenedTrades(res.rows.length);
            console.log('open set refreshed');
          }
        },
      );
    });

    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_journalEntryWithExit',
        [],
        (tx, res) => {
          console.log(res.rows.length);
          if (res.rows.length > 0 || res.rows.length == 0) {
            setNumberOfClosedTrades(res.rows.length);
            console.log('close set refreshed');
          }
        },
      );
    });
    //Db transaction setting saveCloseCustomSettings Data to setNavigatedDataOpen at home page load
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
          } else {
            console.log('No data found');
          }
        },
        (_, error) => {
          console.log('Error while retrieving data', error);
        },
      );
    });
    //Db transaction setting saveCloseCustomSettings Data to setNavigatedDataClose at home page load
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
          } else {
            console.log('No data found');
          }
        },
        (_, error) => {
          console.log('Error while retrieving data', error);
        },
      );
    });
  }, [isFocused]);

  const formNavigate = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigation.navigate('EnterJournal');
      setIsLoading(false);
    }, 100);
  };

  const handleExportPress = () => {
    setExportModalVisible(true);
  };

  const handleExportModalClose = () => {
    setExportModalVisible(false);
  };
 

  const exportDataToExcel = selectedOption => {
    // Do something with the selected option (e.g. export trades)
    let columns = '';
    let query = '';
    if (selectedOption === 'open') {
      columns =
        'Time, Date, Day, Instrument, Category, Trade_Type, Timeframe, Action, Initial_Capital, Deployed_Capital, Name, Entry, Quantity, Lots, Strategy_Name, Stoploss, Trailing_SL, Reason_Of_Trade, Risked_Amount, Risk_Percentage, Trailing_Risk, Target1, Target2, Target3';
      query = `SELECT ${columns} FROM table_journalEntryWithoutExit`;
    } else if (selectedOption === 'closed') {
      columns =
        'Time, Date, Day, Instrument, Category, Trade_Type, Timeframe, Action, Deployed_Capital, Name, Entry, Quantity, Lots, Strategy_Name, Stoploss, All_Open_Charges, Trailing_SL, Reason_Of_Trade, Exit, All_Close_Charges, Risked_Amount, Risk_Percentage, Trailing_Risk, Target1, Target2, Target3, Lessons, CloseDate, CloseTime, CloseDay';
      query = `SELECT ${columns} FROM table_journalEntryWithExit`;
    }
    db.transaction(txn => {
      txn.executeSql(query, [], (tx, results) => {
        let rows = results.rows.raw();
        console.log(rows);
        // Handle the rows

        //creating new excel workbook

        // Created Sample data
        // let sample_data_to_export = [{id: '1', name: 'First User'},{ id: '2', name: 'Second User'}];
        console.log('now about to create excel file');
        let wb = XLSX.utils.book_new();
        console.log('created excel file');
        let ws = XLSX.utils.json_to_sheet(rows);
        console.log('data in excel file' + ws);
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
        console.log('final workbook' + wbout);
        // Write generated excel to Storage with unique names
        const date = new Date();
        const timestamp = (date.getTime() / 100).toFixed(0);
        const filename = selectedOption==='open'?`Open_Trade_${timestamp}.xlsx`:`Close_Trade_${timestamp}.xlsx`;

        RNFS.writeFile(
          RNFS.DownloadDirectoryPath + '/' + filename,
          wbout,
          'ascii',
        )
          .then(r => {
            showMessage({
              message: `Data Exported Successfully. Check Internal_Storage/Downloads/${filename}`,
              type: 'success',
              duration: 3500,
            });
            setExportModalVisible(false)
            console.log('Success');
          })
          .catch(e => {
            console.log('Error', e);
          });
      });
    });
  };

  const handleExportClick = async selectedOption => {
    console.log('reached in handleclick function');
    try {
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!isPermitedExternalStorage) {
        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permission needed',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Checked for permission');

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          console.log('Permission granted');
          exportDataToExcel(selectedOption);
        } else {
          // Permission denied
          console.log('Permission denied');
        }
      } else {
        // Already have Permission (calling our exportDataToExcel function)
        console.log('going to exportData function');
        exportDataToExcel(selectedOption);
      }
    } catch (e) {
      console.log('Error while checking permission');
      console.log(e);
      return;
    }
  };

  

  return (
    <>
      <StatusBar backgroundColor="#010203" />
      <View style={styles.homeHeader}>
        <Pressable
          style={{marginVertical: 12, marginHorizontal: 5}}
          onPress={() => navigation.openDrawer()}>
          <View style={styles.drawerButton} />
          <View style={styles.drawerButton} />
          <View style={styles.drawerButton} />
        </Pressable>
        <Text
          style={{
            color: '#a8a8a8',
            fontSize: 20,
            marginHorizontal: 20,
            marginVertical: 15,
          }}>
          Advanced Trading Journal
        </Text>
        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Pressable onPress={handleExportPress} >
            <View >
            <Image
              source={require('../sidescreen/icons/export2.png')}
              style={{width: 30, height: 30}}
            />
            
            </View>
            
          </Pressable>
          <PopupModalExport
            visible={exportModalVisible}
            onRequestClose={handleExportModalClose}
            onExport={handleExportClick}
          />
        </View>
        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.headerCard}>
          <Text
            adjustsFontSizeToFit={true}
            style={{
              fontWeight: '500',
              textAlign: 'center',
              color: '#ffffe0',
            }}>
            "Your Trading Journal is the only tool which suggests you what 'NOT'
            to do,Else everybody is there to tell you what to 'DO'."
          </Text>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.innerCard}>
                <Pressable
                  onPress={
                    numberOfOpenedTrades > 0
                      ? () => navigation.navigate('JournalsCustomView', {navigatedDataOpen})
                      : null
                  }>
                  <Text
                    style={{
                      fontSize: 50,
                      textShadowColor: '#ffffe0',
                      textShadowRadius: 3,
                      textShadowOffset: {width: -1, height: -1},
                      color: '#353435',
                    }}>
                    {numberOfOpenedTrades}
                  </Text>
                </Pressable>
              </View>
              <Text style={{color: '#ffffe0'}}>Open Trades</Text>
            </View>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.innerCard}>
                <Pressable
                  onPress={
                    numberOfClosedTrades > 0
                      ? () => navigation.navigate('ClosedTradeView', {navigatedDataClose})
                      : null
                  }>
                  <Text
                    style={{
                      fontSize: 50,
                      textShadowColor: '#ffffe0',
                      textShadowRadius: 3,
                      textShadowOffset: {width: -1, height: -1},
                      color: '#353435',
                    }}>
                    {numberOfClosedTrades}
                  </Text>
                </Pressable>
              </View>
              <Text style={{color: '#ffffe0'}}>Closed Trades</Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flex: 2,
        }}>
        <View style={{marginVertical: 20}}>
          <View style={styles.leftAligned1}>
            <Pressable onPress={formNavigate}>
              {isLoading ? (
                <Text style={styles.buttonText}>Loading</Text>
              ) : (
                <Text style={styles.buttonText}>Enter Trade</Text>
              )}
            </Pressable>
          </View>
          <View style={styles.rightAligned1}>
            <Pressable
              onPress={() => {
                navigation.navigate('MyJournals');
              }}>
              <Text style={styles.buttonText}>My Journals</Text>
            </Pressable>
          </View>
          <View style={styles.leftAligned2}>
            <Pressable>
              <Text style={styles.buttonText}>What you learnt</Text>
            </Pressable>
          </View>
          <View style={styles.rightAligned2}>
            <Pressable>
              <Text style={styles.buttonText}>More Apps</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 30,
    marginHorizontal: 10,
  },
  headerCard: {
    borderRadius: 10,
    flex: 1,
    width: '100%',
  },
  innerCard: {
    height: '80%',
    width: '80%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAligned1: {
    alignSelf: 'flex-start',
    backgroundColor: '#9370db',
    width: '50%',
    borderTopStartRadius: 15,
    borderBottomEndRadius: 15,
  },

  rightAligned2: {
    alignSelf: 'flex-start',
    backgroundColor: '#ec3b83',
    width: '50%',
    borderTopStartRadius: 15,
    borderBottomEndRadius: 15,
  },
  leftAligned1: {
    alignSelf: 'flex-end',
    backgroundColor: '#db5a6b',
    width: '50%',
    borderTopStartRadius: 15,
    borderBottomEndRadius: 15,
  },
  leftAligned2: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff006c',
    width: '50%',
    borderTopStartRadius: 15,
    borderBottomEndRadius: 15,
  },

  drawerButton: {
    width: 35,
    borderColor: '#a8a8a8',
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 3,
  },
  homeHeader: {
    borderBottomColor: '#010203',
    borderBottomWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: '#343534',
  },
});
