import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {openDatabase} from 'react-native-sqlite-storage';

let db = openDatabase({name: 'AdvancedJournal.db'});

const UpdateCustom = ({navigation, route}) => {
  const {item} = route.params;

  const [exit, setExit] = useState('');
  const [allCloseCharges, setAllCloseCharges] = useState('');
  const [trailingSL, setTrailingSL] = useState(null);
  const [trailedRisk, setTrailedRisk] = useState(null);
  const [lessons, setLessons] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const [closeDate, setCloseDate] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [closeDay, setCloseDay] = useState('');

  const [tslString, setTslString] = useState('');

  useEffect(() => {
    if (item.Category === 'Cash') {
      if (!item.Trailing_SL || !item.Trailing_Risk) {
        console.log(trailingSL, trailedRisk);
      } else {
        setTrailingSL(item.Trailing_SL);
        setTrailedRisk(item.Trailing_Risk);
        console.log(trailingSL, trailedRisk + 'after if-else set state');
      }
    } else {
    }
  }, []);

  useEffect(() => {
    const getDate = () => {
      const date = new Date().toLocaleDateString();
      setCloseDate(date);
    };

    const getTime = () => {
      const time = new Date().toLocaleTimeString();
      setCloseTime(time);
    };

    const getDay = () => {
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const day = daysOfWeek[new Date().getDay()];
      setCloseDay(day);
    };

    getDate();
    getTime();
    getDay();
    // Delay execution by 1000ms,Learned new trchnique to delay function call
    const timeoutId = setTimeout(() => {
      tradeResult();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      console.log(finalResult + 'final result');
    };
  }, [exit, lessons]);

  const tradeResult = () => {
    if (item.Action === 'LONG') {
      if (item.Lots) {
        result = (exit - item.Entry) * item.Quantity * item.Lots;
        setFinalResult(parseFloat(result).toFixed(2));
      } else {
        result = (exit - item.Entry) * item.Quantity;
        setFinalResult(parseFloat(result).toFixed(2));
      }
    }else{
      if (item.Lots) {
        result = (item.Entry - exit) * item.Quantity * item.Lots;
        setFinalResult(parseFloat(result).toFixed(2));
      } else {
        result = (item.Entry - exit) * item.Quantity;
        setFinalResult(parseFloat(result).toFixed(2));
      }
    }
  };

  const handleInput = (field, value) => {
    switch (field) {
      case 'trailingSL':
        setTrailingSL(value);
        break;
      case 'exit':
        setExit(value);
        break;
      case 'allCloseCharges':
        setAllCloseCharges(value);
        break;
      case 'lesson':
        setLessons(value);
        break;
      default:
        break;
    }
  };
  const timeString = JSON.stringify(item.Time);

  useEffect(() => {
    console.log('SHORT LONG USEEFFECT RUN');
    if (item.Category === 'Cash') {
      if (item.Action == 'SHORT') {
        const newRisk = (item.Entry - trailingSL) * item.Quantity;
        setTrailedRisk(newRisk.toFixed(2));
      } else {
        const newRisk = (trailingSL - item.Entry) * item.Quantity;
        setTrailedRisk(newRisk.toFixed(2));
      }
      const stringifyingTSL = JSON.stringify(trailingSL);
      setTslString(stringifyingTSL);
    } else {
      if (item.Action == 'SHORT') {
        const newRisk = (item.Entry - trailingSL) * item.Quantity * item.Lots;
        setTrailedRisk(newRisk.toFixed(2));
      } else {
        const newRisk = (trailingSL - item.Entry) * item.Quantity * item.Lots;
        setTrailedRisk(newRisk.toFixed(2));
      }
      const stringifyingTSL = JSON.stringify(trailingSL);
      setTslString(stringifyingTSL);
    }
  }, [trailingSL]);

  const update = () => {
    if (!trailingSL && !exit) {
      showMessage({
        message: 'Unable to Update Blank Fields',
        type: 'danger',
        duration: 2500,
      });
    } else if (!exit) {
      db.transaction(txn => {
        txn.executeSql(
          `UPDATE table_journalEntryWithoutExit SET Trailing_SL = ${tslString} , Trailing_Risk = ${trailedRisk} WHERE Time = ${timeString}`,
          [],
          (tx, res) => {
            if (res.rowsAffected == 1) {
              showMessage({
                message: 'Trailing SL Updated Sucessfully',
                type: 'success',
              });
            }
          },
        );
      });
    } else if (!trailingSL) {
      console.log(finalResult);
      db.transaction(txn => {
        txn.executeSql(
          //'DROP TABLE IF EXISTS table_journalEntryWithExit',
          //console.log('table deleted withExit'),

          "SELECT name FROM sqlite_master WHERE type='table' AND name='table_journalEntryWithExit'",
          [],
          (tx, res) => {
            // console.log(res.rows.length);
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
          },
        );

        txn.executeSql(
          `SELECT Time , Date , Day , Instrument , Category , Trade_Type , Timeframe , Action , Initial_Capital , Deployed_Capital , Name , Entry , Quantity , Lots , Strategy_Name , Stoploss , All_Open_Charges, Trailing_SL , Reason_Of_Trade , Risked_Amount , Risk_Percentage , Trailing_Risk , Target1 , Target2 , Target3 FROM table_journalEntryWithoutExit WHERE Time = ${timeString}`,
          [],
          (tx, res) => {
            console.log(res.rows.item(0).Time + 'journalwithoutexit data');
            const item = res.rows.item(0);

            txn.executeSql(
              'INSERT INTO table_journalEntryWithExit(Time, Date, Day, Instrument, Category, Trade_Type, Timeframe, Action, Initial_Capital, Deployed_Capital, Name, Entry, Quantity, Lots, Strategy_Name, Stoploss, All_Open_Charges, Trailing_SL, Reason_Of_Trade, Exit, All_Close_Charges, Risked_Amount, Risk_Percentage, Trailing_Risk, Target1, Target2, Target3, Lessons, CloseDate, CloseTime, CloseDay, Final_PnL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [
                item.Time,
                item.Date,
                item.Day,
                item.Instrument,
                item.Category,
                item.Trade_Type,
                item.Timeframe,
                item.Action,
                item.Initial_Capital,
                item.Deployed_Capital,
                item.Name,
                item.Entry,
                item.Quantity,
                item.Lots,
                item.Strategy_Name,
                item.Stoploss,
                item.All_Open_Charges,
                item.Trailing_SL,
                item.Reason_Of_Trade,
                exit,
                allCloseCharges,
                item.Risked_Amount,
                item.Risk_Percentage,
                item.Trailing_Risk,
                item.Target1,
                item.Target2,
                item.Target3,
                lessons,
                closeDate,
                closeTime,
                closeDay,
                finalResult,
              ],
              (tx, res) => {
                if (res.rowsAffected == 1) {
                  console.log(res.rows.length + 'trade closed with exit');
                  showMessage({
                    message: 'Trade Closed Sucessfully',
                    type: 'success',
                  });
                  txn.executeSql(
                    `DELETE FROM table_journalEntryWithoutExit WHERE Time = ${timeString}`,
                    [],
                    (tx, res) => {
                      if (res.rowsAffected > 0) {
                        console.log(
                          'Opened trade converted to closed trade successfully',
                        );
                        setTimeout(() => {
                          showMessage({
                            message: 'Open List Updated',
                            type: '',
                          });
                        }, 700);
                        
                      }
                    },
                  );
                  navigation.goBack();
                }
              },
            );
          },
        );
      });
    } else {
      showMessage({
        message: 'EXIT & Trail SL cannot be update at a time',
        type: 'info',
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#343534'}}>
      <View style={{marginVertical: 10}}>
        <Text style={{...styles.Heading}}>Update your running Trade</Text>
      </View>
      <View style={styles.executionFlexBox1}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={{left: 10, fontSize: 20, color: '#fdfff5'}}>
              Trailing SL:
            </Text>
            <TextInput
              value={trailingSL}
              onChangeText={value => handleInput('trailingSL', value)}
              keyboardType="numeric"
              placeholder="Trailing SL"
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={{...styles.headerInput}}></TextInput>
          </View>
          <View style={{flex: 1}}>
            <Text style={{left: 10, fontSize: 20, color: '#fdfff5'}}>
              Exit:
            </Text>
            <TextInput
              value={exit}
              onChangeText={value => handleInput('exit', value)}
              keyboardType="numeric"
              placeholder="Exit"
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={styles.headerInput}></TextInput>
          </View>
        </View>
        <View>
          <Text style={{left: 10, fontSize: 20, color: '#fdfff5'}}>
            Closing Charges and Taxes (at exit):
          </Text>
          <TextInput
            value={allCloseCharges}
            onChangeText={value => handleInput('allCloseCharges', value)}
            keyboardType="numeric"
            placeholder="Include only closing taxes and brokerages"
            autoComplete="off"
            disableFullscreenUI={true}
            textAlign="center"
            cursorColor={'#fff'}
            editable={exit ? true : false}
            style={styles.headerInput}></TextInput>
        </View>
        <View>
          <Text style={{left: 10, fontSize: 20, color: '#fdfff5'}}>
            Lessons learned from this trade (at exit):
          </Text>
          <TextInput
            value={lessons}
            onChangeText={value => handleInput('lesson', value)}
            keyboardType="default"
            placeholder="Exit note or some important lesson"
            autoComplete="off"
            disableFullscreenUI={true}
            textAlign="left"
            cursorColor={'#fff'}
            editable={exit ? true : false}
            style={styles.headerInput}></TextInput>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#7f7f7f',
          alignSelf: 'center',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#ff6943',
        }}>
        <TouchableOpacity onPress={update}>
          {exit ? (
            <Text
              style={{
                color: '#fdfff5',
                fontSize: 20,
                paddingHorizontal: 25,
                paddingVertical: 6,
              }}>
              Exit
            </Text>
          ) : (
            <Text
              style={{
                color: '#fdfff5',
                fontSize: 20,
                paddingHorizontal: 25,
                paddingVertical: 6,
              }}>
              Update
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: 10}}>
        <Text style={{...styles.Heading}}>Other Trade Details</Text>
      </View>
      <ScrollView>
        <Text
          style={{
            color: '#fdfff5',
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '700',
          }}>
          #{item.Trade_Type} / {item.Instrument} / {''}{item.Category} /
          <Text style={{color: item.Action == 'LONG' ? 'green' : 'red'}}>
            #{item.Action}
          </Text>
        </Text>
        <Text style={styles.listItems}>Name : {item.Name}</Text>
        <Text style={styles.listItems}>
          Date of entry :{item.Date}-{item.Day}-{item.Time}
        </Text>
        <Text style={styles.listItems}>
          Deployed Capital : {item.Deployed_Capital}
        </Text>
        <Text style={styles.listItems}>Strategy : {item.Strategy_Name}</Text>
        <Text style={styles.listItems}>Initial Entry : {item.Entry}</Text>
        <Text style={styles.listItems}>Initial SL : {item.Stoploss}</Text>
        <Text style={styles.listItems}>
          Initial Quantity : {item.Quantity} Lots: {item.Lots} (Total:{' '}
          {item.Quantity * item.Lots})
        </Text>
        <Text style={styles.listItems}>
          Initial Risk : {item.Risked_Amount} ({item.Risk_Percentage} of
          deployed. cap)
        </Text>
        {!trailingSL ? (
          !item.Trailing_SL ? null : (
            <Text style={styles.listItems}>
              Trailing SL : {item.Trailing_SL}
            </Text>
          )
        ) : (
          <Text style={styles.listItems}>Trailing SL : {trailingSL}</Text>
        )}
        {!trailingSL ? (
          !item.Trailing_SL ? (
            <Text style={styles.listItems}>
              Risk Trailed To: Initial Risk{item.Risked_Amount}
            </Text>
          ) : (
            <Text
              style={{
                color: item.Trailing_Risk < 0 ? 'red' : 'green',
                fontSize: 20,
              }}>
              Risk Trailed To: {item.Trailing_Risk}
            </Text>
          )
        ) : (
          <Text
            style={{color: trailedRisk < 0 ? 'red' : 'green', fontSize: 20}}>
            Risk Trailed To: {trailedRisk}
          </Text>
        )}
        {!exit ? null : <Text style={styles.listItems}>Exit : {exit}</Text>}
      </ScrollView>
    </View>
  );
};

export default UpdateCustom;

const styles = StyleSheet.create({
  Heading: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '900',
    color: '#fdfff5',
    borderColor: '#fdfff5',
    borderWidth: 1,
    borderRadius: 20,
  },
  headerInput: {
    fontWeight: '700',
    backgroundColor: '#7f7f7f',
    margin: 2,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 5,
  },
  listItems: {
    color: '#fdfff5',
    fontSize: 15,
    borderBottomColor: '#ffffbf',
    borderBottomWidth: 1,
    marginHorizontal: 2,
    marginVertical: 5,
  },
});
