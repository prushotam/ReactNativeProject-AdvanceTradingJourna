import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  Dimensions,
  Pressable
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'AdvancedJournal.db'});

const windowWidth = Dimensions.get('window').width;
const pageWidth = windowWidth * 0.95;

const Dashboard = () => {
  const [optionBuyWinningRate, setOptionBuyWinningRate] = useState();
  const [optionSellWinningRate, setOptionSellWinningRate] = useState();
  const [averageRisk, setAverageRisk] = useState();
  const [averageReward, setAverageReward] = useState();
  const [averagePnLperTrade, setAveragePnLperTrade] = useState();
  const [grossPnL, setGrossPnL] = useState();
  const [grossBrokerages, setGrossBrokerages] = useState();
  const [numOfInvestments, setnumOfInvestments] = useState();
  const [numOfTrades, setNumOfTrades] = useState();

useEffect(()=>{
  db.transaction(txn => {
    //Gross PnL calculations
    txn.executeSql( 'SELECT SUM(Final_PnL) AS Gross_PnL FROM table_journalEntryWithExit',
    [],
    (tx,res)=>{
        const grossPnL = res.rows.item(0).Gross_PnL
        setGrossPnL(grossPnL)
        //Gross Brokerage calculations
    })
    txn.executeSql( 'SELECT SUM(All_Close_Charges + All_Open_Charges) AS Gross_brokerages FROM table_journalEntryWithExit',
    [],
    (tx,res)=>{
        const grossBrokerage = res.rows.item(0).Gross_brokerages
        setGrossBrokerages(grossBrokerage)
      })
      //Closed Investments Count
    txn.executeSql( "SELECT COUNT(*) FROM table_journalEntryWithExit WHERE Category='Investment';",
    [],
    (tx,res)=>{
        setnumOfInvestments(res.rows.item(0)["COUNT(*)"]);
    })
    //Closed Trades Count
    txn.executeSql( "SELECT COUNT(*) FROM table_journalEntryWithExit WHERE Category!='Investment';",
    [],
    (tx,res)=>{
        setNumOfTrades(res.rows.item(0)["COUNT(*)"]);
    })
    //Option buy & Option sell winning rate calculations
    txn.executeSql(
      "SELECT 100.0 * COUNT(CASE WHEN Final_PnL > 0 AND Action = 'LONG' THEN 1 END) / COUNT(*) AS OptionBuyingWinningRate, 100.0 * COUNT(CASE WHEN Final_PnL > 0 AND Action = 'SHORT' THEN 1 END) / COUNT(*) AS OptionSellingWinningRate FROM table_journalEntryWithExit WHERE Category = 'Options'",
      [],
      (tx,res)=>{
        
        setOptionBuyWinningRate(res.rows.item(0).OptionBuyingWinningRate.toFixed(2));
        setOptionSellWinningRate(res.rows.item(0).OptionSellingWinningRate.toFixed(2));
        
      }
    );
    //Average RisK calculations
    txn.executeSql(
      "SELECT AVG(Risked_Amount) AS AverageRisk FROM table_journalEntryWithExit",
      
      [],
      (tx,res)=>{
        setAverageRisk(res.rows.item(0).AverageRisk.toFixed(2));
        
        
      }
    );
    //Average Reward calculations
    txn.executeSql(
      "SELECT AVG(Final_PnL) AS AverageReward FROM table_journalEntryWithExit",
      [],
      (tx,res)=>{
        setAverageReward(res.rows.item(0).AverageReward.toFixed(2));
        
        
      }
    );
})
})



  const scrollViewRef = useRef();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const scrollToNext = () => {
    const nextIndex = currentPageIndex + 1;
    if (nextIndex < 7) {
      scrollViewRef.current.scrollTo({
        x: windowWidth * nextIndex,
        y: 0,
        animated: true,
      });
      setCurrentPageIndex(nextIndex);
    }
  };
  const scrollToPrev = () => {
    const prevIndex = currentPageIndex - 1;
    if (prevIndex >= 0) {
      scrollViewRef.current.scrollTo({
        x: windowWidth * prevIndex,
        y: 0,
        animated: true,
      });
      setCurrentPageIndex(prevIndex);
    }
  };

  return (
    <ScrollView style={{flex: 1}}>

      <View style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <View style={styles.headBulb}>
        <Text style={styles.headBulbText1}>One-View</Text>
        <Text style={styles.headBulbText2}>Analytics</Text>
      </View>
      </View>
      <View style={styles.grossPLContainer}>
      <View style={{flex:1}}>
      <View style={styles.grossPLValueContainer}>
        <Text style={styles.grossPLLabel}>Gross PnL</Text>
        <View>
          <Text style={styles.grossPLValue}>{grossPnL}</Text>
        </View>
      </View>
      <View style={styles.grossPLValueContainer}>
        <Text style={styles.grossPLLabel}>Closed Investments</Text>
        <View>
          <Text style={styles.grossPLValue}>{numOfInvestments}</Text>
        </View>
      </View>
      </View>
      <View style={{flex:1}}>
      <View style={styles.grossPLValueContainer}>
        <Text style={styles.grossPLLabel}>Gross Brokerages</Text>
        <View>
          <Text style={styles.grossPLValue}>{grossBrokerages}</Text>
        </View>
      </View>
      <View style={styles.grossPLValueContainer}>
        <Text style={styles.grossPLLabel}>Closed Trades</Text>
        <View>
          <Text style={styles.grossPLValue}>{numOfTrades}</Text>
        </View>
      </View>
      </View>
      </View>
      
      
      <View style={{flex: 1}}>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          pagingEnabled={true}
          style={styles.pageContainer}>
          <View style={styles.page}>
            <Text style={styles.grossPLLabel}>Option Buy Winning Rate</Text>
            <View style={styles.pageContent}>
            <Text style={{color:'#c593a0',fontStyle:'italic'}}>
                This metric suggests you how much percent of winning rate you are having in Options Buying.
              </Text>
              <View style={styles.ScrollHorizontalContainer}>
              <Text style={styles.grossPLValue}>{optionBuyWinningRate}%</Text>
              </View>
            </View>
          </View>
          <View style={styles.page}>
            <Text style={styles.grossPLLabel}>Option Sell Winning Rate</Text>
            <View style={styles.pageContent}>
            <Text style={{color:'#c593a0',fontStyle:'italic'}}>
                This metric suggests you how much percent of winning rate you are having in Options Selling.
              </Text>
              <View style={styles.ScrollHorizontalContainer}>
              <Text style={styles.grossPLValue}>{optionSellWinningRate}%</Text>
              </View>
            </View>
          </View>
          <View style={styles.page}>
            <Text style={styles.grossPLLabel}>Average Risk : Reward</Text>
            <View style={styles.pageContent}>
            <Text style={{color:'#c593a0',fontStyle:'italic'}}>
                This metric calculates the average risk you taken and average reward you get including all types of trades.
              </Text>
              <View style={styles.ScrollHorizontalContainer}>
              <Text style={styles.grossPLValue}>{averageRisk} : {averageReward}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <View style={{backgroundColor:'#000040',padding:10,borderRadius:80,borderColor:'#fff',borderWidth:1}}>
          <Pressable onPress={scrollToPrev}>
            <Text style={{fontSize:20,color:'#fff'}}>PREV</Text>
          </Pressable>
          </View>
          <View style={{backgroundColor:'#000040',padding:10,borderRadius:80,borderColor:'#fff',borderWidth:1}}>
          <Pressable onPress={scrollToNext}>
            <Text style={{fontSize:20,color:'#fff'}}>NEXT</Text>
          </Pressable>
          </View>
          
        </View>
        
      </View>
    
    </ScrollView>
    
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  pageContent: {
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: pageWidth - 10,
    height: '90%',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#343534',
    borderRadius: 10,
  },
  page: {
    width: pageWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#343534',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pageLabel: {
    color:'#ffffbf',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  
  headBulbText1: {
    color: '#010203',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: '#fff',
    textShadowRadius: 3,
    textShadowOffset: {width: -1, height: -1},
  },
  headBulbText2: {
    color: '#010203',
    fontSize: 45,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: '#fff',
    textShadowRadius: 3,
    textShadowOffset: {width: -1, height: -1},
  },
  itemContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: '700',
    backgroundColor: '#ec3b83',
    zIndex: 1,
    borderRadius: 10,
    borderColor: '#131414',
    borderWidth: 2,
    color: '#fffff0',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grossPLContainer: {
    backgroundColor: '#000040', // white background
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical:5,
    marginTop: 20,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  grossPLLabel: {
    color: '#BFBFBF', // light grey text
    fontSize: 16,
    fontWeight: 'bold',
  },
  grossPLValueContainer: {
    backgroundColor: '#0102', // green background for value
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  grossPLValue: {
    color: '#0ff', // white text
    fontSize: 16,
    fontWeight: 'bold',
    padding:25
  },
  ScrollHorizontalContainer:{
    borderWidth:1,
    backgroundColor:'#000040',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
});
