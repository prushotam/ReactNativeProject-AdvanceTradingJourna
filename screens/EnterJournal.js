import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import React from 'react';
import BackButton from '../src/commonWidgets/BackButton';
import {useState, useEffect} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import {openDatabase} from 'react-native-sqlite-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
//opening DB
let db = openDatabase({
  name: 'AdvancedJournal.db',
  location: 'default',
});

const EnterJournal = ({navigation}) => {
  //handling dropdown select list
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState('');
  const [selected3, setSelected3] = useState('');
  const [selected4, setSelected4] = useState('');
  const [selected5, setSelected5] = useState('');

  //Data values for Dropdown SelectList
  const data1 = [
    {key: '1', value: 'Future'},
    {key: '2', value: 'Options'},
    {key: '3', value: 'Cash'},
    {key: '4', value: 'Investment'},
  ];
  const data2 = [
    {key: '1', value: 'Intraday'},
    {key: '2', value: 'Positional'},
  ];
  const data3 = [
    {key: '1', value: 'Stocks'},
    {key: '2', value: 'Index'},
    {key: '3', value: 'Forex'},
    {key: '4', value: 'Commodities'},
  ];
  const data4 = [
    {key: '1', value: '1 Min'},
    {key: '2', value: '3 Min'},
    {key: '3', value: '5 Min'},
    {key: '4', value: '10 Min'},
    {key: '5', value: '15 Min'},
    {key: '6', value: '20 Min'},
    {key: '7', value: '30 Min'},
    {key: '8', value: '45 Min'},
    {key: '9', value: '1 Hour'},
    {key: '10', value: '2 Hour'},
    {key: '11', value: '3 Hour'},
    {key: '12', value: '4 Hour'},
    {key: '13', value: '1 Day'},
    {key: '14', value: '1 Week'},
    {key: '15', value: '1 Month'},
  ];
  const data5 = selected1=='Investment'?[{key: '1', value: 'LONG'},]:[
    {key: '1', value: 'LONG'},
    {key: '2', value: 'SHORT'},
  ];
  // All state variables for form inputs
  const [capital, setCapital] = useState('');
  const [deployedCapital, setDeployedCapital] = useState('');
  const [stockIndexFutOptName, setStockIndexFutOptName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lots, setLots] = useState('');
  const [entry, setEntry] = useState('');
  const [stoploss, setStoploss] = useState('');
  const [allCharges, setAllCharges] = useState('');
  const [strategy, setStrategy] = useState('');
  const [trailingSL, setTrailingSL] = useState('');
  const [reasonOfTrade, setReasonOfTrade] = useState('');
  const [riskedAmount, setRiskedAmount] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [trailedRisk, setTrailedRisk] = useState('');
  const [target1, setTarget1] = useState('');
  const [target2, setTarget2] = useState('');
  const [target3, setTarget3] = useState('');
  //state variables holding date,time,and day default values
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [day, setDay] = useState('');

  //extra required states for local operations
  const [extraError, setExtraError] = useState('');
  const [extraError2, setExtraError2] = useState('');
  const [savingData, setSavingData] = useState(false);
  useEffect(() => {
    if (capital && deployedCapital) {
      const deployedCapitalNumber = parseInt(deployedCapital);
      const CapitalNumber = parseInt(capital);
      if (deployedCapitalNumber > CapitalNumber) {
        setExtraError(true);
      } else {
        setExtraError(false);
      }
    } else {
      setExtraError(false);
    }
  }, [deployedCapital, capital]);

  useEffect(() => {
    const intsl = parseFloat(stoploss);
    const intentry = parseFloat(entry)

    if (!selected5 || !entry || !stoploss) {
    } else if (selected5 === 'LONG')
    
      if (intsl > intentry) {
        setExtraError2(true);
      } else {
        setExtraError2(false);
      }
    else if (selected5 === 'SHORT') {
      if (intsl < intentry) {
        setExtraError2(true);
      } else {
        setExtraError2(false);
      }
    }
  }, [stoploss,entry,selected5]);
  //Clearing states of disabled selectlists to empty
  useEffect(()=>{
    if(selected1==='Investment'){
      setSelected2('')
      setSelected4('')
    }
  },[selected1])

  //Databse creation is shifted to Home page launch so directly Inserting data in tables according to condition check
  const saveData = () => {
    if (extraError) {
      showMessage({
        message: 'Deployed capital cannot be greater than capital',
        type: 'danger',
      });
    } else {
      if (selected1 === 'Investment') {
        if (
          !selected3 ||
          !selected1 ||
          !selected5 ||
          !capital ||
          !deployedCapital ||
          !stockIndexFutOptName ||
          !quantity ||
          !entry ||
          !stoploss ||
          !allCharges ||
          !strategy ||
          !reasonOfTrade ||
          !riskedAmount ||
          !riskPercentage ||
          !target1 ||
          !target2 ||
          !target3
          
        ) {
          showMessage({
            message: 'Empty fields are not allowed',
            type: 'danger',
          });
        } else {
          db.transaction(txn => {
            txn.executeSql(
              'INSERT INTO table_journalEntryWithoutExit(Time , Date , Day , Instrument , Category , Trade_Type , Timeframe , Action , Initial_Capital , Deployed_Capital , Name , Entry , Quantity , Lots , Strategy_Name , Stoploss , All_Open_Charges, Trailing_SL , Reason_Of_Trade , Risked_Amount , Risk_Percentage , Trailing_Risk , Target1 , Target2 , Target3) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',

              [
                time,
                date,
                day,
                selected3,
                selected1,
                selected2,
                selected4,
                selected5,
                capital,
                deployedCapital,
                stockIndexFutOptName,
                entry,
                quantity,
                lots,
                strategy,
                stoploss,
                allCharges,
                trailingSL,
                reasonOfTrade,
                riskedAmount,
                riskPercentage,
                trailedRisk,
                target1,
                target2,
                target3,
              ],
              (tx, res) => {
                if (res.rowsAffected == 1) {
                  // console.log('Table-journalWithoutExit Updated Successfully');
                  setSavingData(true);
                   setTimeout(() => {
                    reset()
                    showMessage({
                      message: 'Trade opened successfully',
                      type: 'success',
                    });
                    setSavingData(false);
                      }, 100);
                }
              },
            );
          });
        }
      } else {
        if (
          !selected3 ||
          !selected1 ||
          !selected2 ||
          !selected4 ||
          !selected5 ||
          !capital ||
          !deployedCapital ||
          !stockIndexFutOptName ||
          !quantity ||
          !lots ||
          !entry ||
          !stoploss ||
          !allCharges ||
          !strategy ||
          !reasonOfTrade ||
          !riskedAmount ||
          !riskPercentage ||
          !target1 ||
          !target2 ||
          !target3
        ) {
          showMessage({
            message: 'Empty fields are not allowed',
            type: 'danger',
          });
        } else {
          db.transaction(txn => {
            txn.executeSql(
              'INSERT INTO table_journalEntryWithoutExit(Time , Date , Day , Instrument , Category , Trade_Type , Timeframe , Action , Initial_Capital , Deployed_Capital , Name , Entry , Quantity , Lots , Strategy_Name , Stoploss ,All_Open_Charges, Trailing_SL , Reason_Of_Trade , Risked_Amount , Risk_Percentage , Trailing_Risk , Target1 , Target2 , Target3) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',

              [
                time,
                date,
                day,
                selected3,
                selected1,
                selected2,
                selected4,
                selected5,
                capital,
                deployedCapital,
                stockIndexFutOptName,
                entry,
                quantity,
                lots,
                strategy,
                stoploss,
                allCharges,
                trailingSL,
                reasonOfTrade,
                riskedAmount,
                riskPercentage,
                trailedRisk,
                target1,
                target2,
                target3,
              ],
              (tx, res) => {
                if (res.rowsAffected == 1) {
                  // console.log('Table-journalWithoutExit Updated Successfully');
                  setSavingData(true);
                   setTimeout(() => {
                    reset()
                    showMessage({
                      message: 'Trade opened successfully',
                      type: 'success',
                    });
                    setSavingData(false);
                      }, 100);
                  
                }
              },
            );
          });
        }
      }
    }
  };

  const reset = () => {
    setDate(''),
      setTime(''),
      setDay(''),
      setTarget3(''),
      setTarget2(''),
      setTarget1(''),
      setRiskPercentage('');
    setRiskedAmount(''),
      setReasonOfTrade(''),
      setStrategy(''),
      setStoploss(''),
      setAllCharges(''),
      setEntry(''),
      setLots(''),
      setQuantity(''),
      setStockIndexFutOptName(''),
      setDeployedCapital(''),
      setCapital('');
  };

  //handling inputs to manage states

  const handleInput = (field, value) => {
    switch (field) {
      // case 'date':
      //   setDate(value);
      //   break;
      // case 'time':
      //   setTime(value);
      //   break;
      case 'capital':
        setCapital(value);
        break;
      case 'deployedCapital':
        setDeployedCapital(value);
        break;
      case 'stockIndexFutOptName':
        setStockIndexFutOptName(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'lots':
        setLots(value);
        break;
      case 'entry':
        setEntry(value);
        break;
      case 'stoploss':
        setStoploss(value);
        break;
      case 'allCharges':
        setAllCharges(value);
        break;
      case 'strategy':
        setStrategy(value);
        break;
      case 'reasonOfTrade':
        setReasonOfTrade(value);
        break;
      default:
        break;
    }
  };

  //Getting local date and time values and setting in respected states

  const DateTime = () => {
    useEffect(() => {
      const getDate = () => {
        const date = new Date().toLocaleDateString();
        setDate(date);
      };

      const getTime = () => {
        const time = new Date().toLocaleTimeString();
        setTime(time);
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
        setDay(day);
      };

      getDate(), getTime(), getDay();
    }, [entry]);
    return {date, time, day};
  };

  const riskCalculate = () => {
if(selected1==='Investment'){
  if (selected5 == 'SHORT') {
    const result1 = (entry - stoploss) * quantity;
    setRiskedAmount(result1.toFixed(2));
    
  } else {
    const result1 = (stoploss - entry) * quantity;
    setRiskedAmount(result1.toFixed(2));
    
  }
}else{
  if (selected5 == 'SHORT') {
    const result1 = (entry - stoploss) * quantity*lots;
    setRiskedAmount(result1.toFixed(2));
   
  } else {
    const result1 = (stoploss - entry) * quantity*lots;
    setRiskedAmount(result1.toFixed(2));
    
  }
}
  };
useEffect(()=>{
  
    if (riskedAmount) {
      const result2 = (riskedAmount / deployedCapital) * 100;
      setRiskPercentage(result2.toFixed(2) + '%');
    }
  
},[riskedAmount])
  
  useEffect(() => {
    if (selected1 === 'Investment') {
      const depCap = entry * quantity;
      setDeployedCapital(depCap.toString());
    }
  }, [quantity]);

  const target = () => {
    if (!selected5) {
    } else if (selected5 == 'LONG') {
      const t1 = entry - stoploss + Number(entry);
      const t2 = (entry - stoploss) * 2 + Number(entry);
      const t3 = (entry - stoploss) * 3 + Number(entry);
      setTarget1(t1.toFixed(2));
      setTarget2(t2.toFixed(2));
      setTarget3(t3.toFixed(2));
    } else {
      const t1 = (stoploss - entry) * -1 + Number(entry);
      const t2 = (stoploss - entry) * -2 + Number(entry);
      const t3 = (stoploss - entry) * -3 + Number(entry);
      setTarget1(t1.toFixed(2));
      setTarget2(t2.toFixed(2));
      setTarget3(t3.toFixed(2));
    }
  };

  return (
    <ScrollView>
      <View style={{flex: 1, backgroundColor: '#343534'}}>
        <View style={{marginVertical: 10}}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.Heading}>Open your Trades</Text>
        </View>
        <View style={styles.headerFlexBox}>
          <View>
            <Text style={styles.headerText}>Date:</Text>
            <TextInput
            value={DateTime().date}
            placeholder="Day"
            editable={false}
            style={styles.headerInput}></TextInput>
          </View>
          <View>
            <Text style={styles.headerText}>Time:</Text>
            <TextInput
              value={DateTime().time}
              placeholder="Day"
              editable={false}
              style={styles.headerInput}></TextInput>
          </View>
          <View>
            <Text style={styles.headerText}>Day:</Text>
            <TextInput
              value={DateTime().day}
              placeholder="Day"
              editable={false}
              style={styles.headerInput}></TextInput>
          </View>
        </View>
        <View style={styles.dropdownContainerFlexbox}>
          <View>
            <SelectList
              setSelected={val => setSelected3(val)}
              data={data3}
              save="value"
              placeholder="Instrument"
              search={false}
              boxStyles={{borderColor: '#fdfff5', margin: 3}}
              inputStyles={{color: '#fdfff5'}}
              dropdownTextStyles={{color: '#fdfff5'}}
              maxHeight={100}
            />
          </View>
          <View>
            <SelectList
              setSelected={val => setSelected1(val)}
              data={data1}
              save="value"
              placeholder="Category"
              search={false}
              boxStyles={{borderColor: '#fdfff5', margin: 3}}
              inputStyles={{color: '#fdfff5'}}
              dropdownTextStyles={{color: '#fdfff5'}}
              maxHeight={100}
            />
          </View>
          <View>
            {selected1==='Investment'?null:
              <SelectList
              setSelected={val => setSelected2(val)}
              data={data2}
              save="value"
              placeholder="Trade Type"
              search={false}
              boxStyles={{borderColor: '#fdfff5', margin: 3}}
              inputStyles={{color: '#fdfff5'}}
              dropdownTextStyles={{color: '#fdfff5'}}
              maxHeight={100}
            />
            }
            
          </View>
          <View>
          {selected1==='Investment'?null:
            <SelectList
              setSelected={val => setSelected4(val)}
              data={data4}
              save="value"
              placeholder="Timeframe used"
              search={false}
              boxStyles={{borderColor: '#fdfff5', margin: 3}}
              inputStyles={{color: '#fdfff5'}}
              dropdownTextStyles={{color: '#fdfff5'}}
              maxHeight={100}
            />
          }
          </View>

          <View>
            <SelectList
              setSelected={val => setSelected5(val)}
              data={data5}
              save="value"
              placeholder="Action"
              search={false}
              boxStyles={{borderColor: '#fdfff5', margin: 3}}
              inputStyles={{color: '#fdfff5'}}
              dropdownTextStyles={{color: '#fdfff5'}}
              maxHeight={100}
            />
          </View>
        </View>
        <View style={{}}>
          <View style={styles.capitalFlexBox}>
            <View style={{flex: 2}}>
              <Text style={{textAlign: 'center', color: '#fdfff5'}}>
                TotalCapital:
              </Text>
              <TextInput
                value={capital}
                onChangeText={value => handleInput('capital', value)}
                keyboardType="numeric"
                placeholder="Auto Updatable"
                autoComplete="off"
                disableFullscreenUI={true}
                textAlign="left"
                cursorColor={'#fff'}
                style={{...styles.headerInput}}></TextInput>
            </View>
            <View style={{flex: 2}}>
              <Text style={{textAlign: 'center', color: '#fdfff5'}}>
                Deployed Capital
              </Text>
              <TextInput
                value={deployedCapital}
                onChangeText={value => handleInput('deployedCapital', value)}
                keyboardType="numeric"
                placeholder={
                  selected1 === 'Investment' ? 'Auto' : 'Capital/Margin Used'
                }
                editable={selected1 === 'Investment' ? false : true}
                autoComplete="off"
                disableFullscreenUI={true}
                textAlign="left"
                cursorColor={'#fff'}
                style={
                  extraError
                    ? {...styles.headerInput, borderColor: '#ff0000'}
                    : styles.headerInput
                }
              />
              {extraError && (
                <Text
                  style={{color: '#ff0000', textAlign: 'center', fontSize: 8}}>
                  Deployed capital cannot exceed total capital.
                </Text>
              )}
            </View>
            <View style={{flex: 2}}>
              <Text style={{textAlign: 'center', color: '#fdfff5'}}>
                Stock/fut/opt name
              </Text>
              <TextInput
                value={stockIndexFutOptName}
                onChangeText={value =>
                  handleInput('stockIndexFutOptName', value)
                }
                keyboardType="default"
                placeholder="Reliance-Dec-Fut"
                autoCapitalize="characters"
                autoComplete="off"
                disableFullscreenUI={true}
                textAlign="center"
                cursorColor={'#fff'}
                style={{...styles.headerInput}}></TextInput>
            </View>
          </View>
        </View>
        <View style={styles.executionFlexBox1}>
          <View style={{flex: 1}}>
            <Text style={{textAlign: 'center', color: '#fdfff5'}}>
              Entry Price:
            </Text>
            <TextInput
              value={entry}
              onChangeText={value => handleInput('entry', value)}
              keyboardType="numeric"
              placeholder="Entry"
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={{...styles.headerInput}}></TextInput>
          </View>
          <View style={{flex: 1}}>
            <Text style={{textAlign: 'center', color: '#fdfff5'}}>
              LotSize/Qty:
            </Text>
            <TextInput
              value={quantity}
              onChangeText={value => handleInput('quantity', value)}
              keyboardType="numeric"
              placeholder="Quantity"
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={{...styles.headerInput}}></TextInput>
          </View>

          <View style={{flex: 1}}>
            <Text style={{textAlign: 'center', color: '#fdfff5'}}>
              No.of Lots:
            </Text>
            <TextInput
              value={lots}
              onChangeText={value => handleInput('lots', value)}
              keyboardType="numeric"
              placeholder={
                selected1 === 'Investment' ? 'Not-required for Investment' : 'Atleast 1 lot'
              }
              editable={selected1 === 'Investment' ? false : true}
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={{...styles.headerInput}}></TextInput>
          </View>
        </View>
        <View style={styles.executionFlexBox2}>
          <View style={{flex: 1}}>
            <Text style={{textAlign: 'center', color: '#fdfff5'}}>
              Strategy Name:
            </Text>
            <TextInput
              value={strategy}
              onChangeText={value => handleInput('strategy', value)}
              keyboardType="default"
              placeholder="Describe Strategy"
              multiline={true}
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={{...styles.headerInput}}></TextInput>
          </View>
          <View style={{flex: 1}}>
            <Text style={{textAlign: 'center', color: '#fdfff5'}}>
              Stoploss Price:
            </Text>
            <TextInput
              value={stoploss}
              onChangeText={value => handleInput('stoploss', value)}
              keyboardType="numeric"
              placeholder="Initial SL Price"
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={
                extraError2
                  ? {...styles.headerInput, borderColor: '#ff0000'}
                  : styles.headerInput
              }></TextInput>
            {extraError2 && (
              <Text
                style={{color: '#ff0000', textAlign: 'center', fontSize: 8}}>
                SL should be smaller than entry if LONG and greater in case of SHORT.
              </Text>
            )}
          </View>
          <View style={{flex: 1}}>
            <Text style={{textAlign: 'center', color: '#fdfff5'}}>
              Brokerages&Taxes:
            </Text>
            <TextInput
              value={allCharges}
              onChangeText={value => handleInput('allCharges', value)}
              keyboardType="numeric"
              placeholder="Atleast set 00"
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={{...styles.headerInput}}></TextInput>
          </View>
        </View>
        <View style={styles.executionFlexBox3}>
          <View style={{flex: 3}}>
            <Text style={{textAlign: 'center', color: '#fdfff5'}}>
              Reason or Logic of your Trade:
            </Text>
            <TextInput
              value={reasonOfTrade}
              onChangeText={value => handleInput('reasonOfTrade', value)}
              keyboardType="default"
              placeholder="Why you entered this trade?"
              multiline={true}
              autoComplete="off"
              disableFullscreenUI={true}
              textAlign="left"
              cursorColor={'#fff'}
              style={{...styles.headerInput}}></TextInput>
          </View>
        </View>
        <View style={styles.autoCalculatedSectionFlexbox}>
          <Text style={styles.autoCalculateHeader}>-:Risk & Targets:-</Text>
        </View>
        <View style={{borderWidth: 1, borderRadius: 5}}>
          <View style={styles.autoCalculateContent}>
            <Text style={styles.autoCalculateText}>Risked Amount :</Text>
            <TextInput
              value={riskedAmount.toString()}
              editable={false}
              style={{...styles.autoCalculateText, color: '#ff0000'}}
            />
          </View>
          <View style={styles.autoCalculateContent}>
            <Text style={styles.autoCalculateText}>Risk Percentage (%) :</Text>
            <TextInput
              value={riskPercentage.toString()}
              editable={false}
              style={{...styles.autoCalculateText, color: '#ff0000'}}
            />
          </View>

          <View style={styles.autoCalculateContent}>
            <Text style={styles.autoCalculateText}>Target-1 (1:1) :</Text>
            <TextInput
              value={target1.toString()}
              editable={false}
              style={{...styles.autoCalculateText, color: '#00ffff'}}
            />
          </View>
          <View style={styles.autoCalculateContent}>
            <Text style={styles.autoCalculateText}>Target-2 (1:2) :</Text>
            <TextInput
              value={target2.toString()}
              editable={false}
              style={{...styles.autoCalculateText, color: '#00ffff'}}
            />
          </View>
          <View style={styles.autoCalculateContent}>
            <Text style={styles.autoCalculateText}>Target-3 (1:3) :</Text>
            <TextInput
              value={target3.toString()}
              editable={false}
              style={{...styles.autoCalculateText, color: '#00ffff'}}
            />
          </View>
          <View style={styles.autoCalculateContent}>
            <Pressable
              style={styles.Button}
              onPress={() => {
                if (selected1 === 'Investment') {
                  if (
                    !entry ||
                    !quantity ||
                    !stoploss ||
                    !stockIndexFutOptName
                  ) {
                    showMessage({
                      message: "Empty fields couldn't validate",
                      type: 'danger',
                      color: '#fff', // text color
                    });
                  } else {
                    riskCalculate();
                    target();
                    showMessage({
                      message: 'Validated',
                      type: 'success',
                      color: '#fff', // text color
                    });
                  }
                } else {
                  if (
                    !entry ||
                    !quantity ||
                    !lots ||
                    !stoploss ||
                    !stockIndexFutOptName
                  ) {
                    showMessage({
                      message: "Empty fields couldn't validate",
                      type: 'danger',
                      color: '#fff', // text color
                    });
                  } else {
                    riskCalculate();
                    target();
                    showMessage({
                      message: 'Validated',
                      type: 'success',
                      color: '#fff', // text color
                    });
                    
                  }
                }
              }}>
              <Text style={{color: '#fdfff5'}}>Validate</Text>
            </Pressable>

            <Pressable
              style={styles.Button}
              onPress={() => {
                reset();
              }}>
              <Text style={{color: '#fdfff5'}}>Reset</Text>
            </Pressable>
            <Pressable
              style={styles.Button}
              onPress={() => {
                saveData();
              }}>
                {savingData?
                <Text style={{color: '#fdfff5'}}>Saving</Text>
                :
                <Text style={{color: '#fdfff5'}}>Submit & Save</Text>
              }
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EnterJournal;

const styles = StyleSheet.create({
  autoCalculateText: {
    flex: 1.5,
    fontWeight: '900',
    color: `white`,
    fontSize: 20,
  },
  autoCalculateTextInput: {
    flex: 2,
  },
  autoCalculatedSectionFlexbox: {
    marginHorizontal: 2,
  },
  autoCalculateHeader: {
    textAlign: 'center',
    backgroundColor: '#ff006c',
    fontSize: 15,
    fontWeight: '300',
    color: '#fdfff5',
  },
  autoCalculateContent: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#585858',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button: {
    flex: 2,
    backgroundColor: '#343534',
    marginVertical: 5,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fdfff5',
  },
  Heading: {
    textAlign: 'center',
    fontSize: 17,
    color: '#fdfff5',
    borderColor: '#fdfff5',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#9370db',
  },
  capitalFlexBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dropdownContainerFlexbox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  executionFlexBox1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  executionFlexBox2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  executionFlexBox3: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  headerFlexBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  headerText: {
    fontWeight: '700',
    margin: 2,
    paddingHorizontal: 50,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 5,
    color: '#fdfff5',
  },
  headerInput: {
    fontWeight: '700',
    backgroundColor: '#7f7f7f',
    margin: 2,
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 5,
  },
});
