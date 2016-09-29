import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  ScrollView,
  TouchableHighlight,
} from 'react-native'
import _ from 'lodash'

var monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    var startTime = this.props.startTime || new Date();
    var holiday = this.props.holiday || {};
    var check = this.props.check || {};
    var locked = this.props.locked || {};
    var checked = this.props.checked || '';
    var headerStyle = this.props.headerStyle || {};

    var num = this.props.num || 4;
    this.state = {
      startTime: startTime,
      num: num,
      holiday: holiday,
      check: check,
      locked: locked,
      checked: checked,
      headerStyle: headerStyle
    };
  }

  componentWillReceiveProps(nextProps) {
    var startTime = nextProps.startTime || new Date();
    var holiday = nextProps.holiday || {};
    var check = nextProps.check || {};
    var locked = nextProps.locked || {};
    var checked = nextProps.checked || '';
    var headerStyle = nextProps.headerStyle || {};

    var num = nextProps.num || 4;
    this.setState({
      startTime: startTime,
      num: num,
      holiday: holiday,
      check: check,
      locked: locked,
      checked: checked,
      headerStyle: headerStyle
    });
  }

  onPress(dateStr) {
    if (this.props.touchEvent) {
      this.props.touchEvent(dateStr);
    }
  }

  render() {
    var date = this.state.startTime;
    var num = this.state.num;
    var holiday = this.state.holiday;
    var check = this.state.check;
    var locked = this.state.locked;
    var checked = this.state.checked;
    var headerStyle = this.state.headerStyle;
    var styles = this.props.style || styles;

    var items = [];
    var dateNow = new Date();

    for(var n = 0; n < num; n++){
      var rows = [];
      var newDate = new Date(date.getFullYear(), date.getMonth() + 1 + n, 0);
      var week = new Date(date.getFullYear(), date.getMonth() + n, 1).getDay();

      if(week === 0){
        week = 7;
      }
      var counts = newDate.getDate();
      var rowCounts = Math.ceil((counts + week - 1) / 7);
      for(var i = 0; i < rowCounts; i++){
        var days = [];
        for(var j = (i * 7) + 1; j < ((i+1) * 7) + 1; j++){
          var dayNum = j - week + 1;
          if(dayNum > 0 && j < counts + week){
            var dateObj = new Date(date.getFullYear(), date.getMonth() + n, dayNum);
            var dateStr = dateObj.getFullYear() + '-' + _.padStart((dateObj.getMonth() + 1), 2, 0) + '-' + _.padStart(dayNum, 2, 0);
            var grayStyle = {};
            var bk = {};
            if(dateNow >= new Date(date.getFullYear(), date.getMonth() + n, dayNum + 1)){
              grayStyle = {
                color:'#ccc'
              };
            }
            if(holiday[dateStr]){
              dayNum = holiday[dateStr];
            }
            if(check[dateStr] || checked === dateStr){
              bk = {
                backgroundColor: locked[dateStr] ? '#777' : '#0bb7db',
                width:46,
                height:35,
                alignItems: 'center',
                justifyContent: 'center'
              };
              grayStyle = {
                color:'#fff'
              };
            }
            days.push(
              <TouchableHighlight
                key={j*100}
                style={[styles.flex_1]}
                underlayColor="#fff"
                onPress={this.onPress.bind(this, dateStr)}
                >
                <View style={bk}>
                  <Text style={grayStyle}>{dayNum}</Text>
                </View>
              </TouchableHighlight>
            );
          }else{
            days.push(
              <View key={j*100} style={[styles.flex_1]}>
                <Text></Text>
              </View>
            );
          }

        }
        rows.push(
          <View key={`${i*1000}`} style={styles.row}>{days}</View>
        );
      }
      items.push(
        <View key={n} style={[styles.cm_bottom]}>
          <View style={styles.month}>
            <Text style={styles.month_text}>
              {I18n.t('date.month_names')[(newDate.getMonth() + 1)]} {newDate.getFullYear()}
            </Text>
          </View>
          {rows}
        </View>
      );

    }

    return (
        <View style={styles.calendar_container}>

          <View style={[styles.row, styles.row_header, this.props.headerStyle]}>
            <View style={[styles.flex_1]}>
              <Text style={this.props.headerStyle}>{I18n.t('date.abbr_day_names')[1]}</Text>
            </View>
            <View style={[styles.flex_1]}>
              <Text style={this.props.headerStyle}>{I18n.t('date.abbr_day_names')[2]}</Text>
            </View>
            <View style={[styles.flex_1]}>
              <Text style={this.props.headerStyle}>{I18n.t('date.abbr_day_names')[3]}</Text>
            </View>
            <View style={[styles.flex_1]}>
              <Text style={this.props.headerStyle}>{I18n.t('date.abbr_day_names')[4]}</Text>
            </View>
            <View style={[styles.flex_1]}>
              <Text style={this.props.headerStyle}>{I18n.t('date.abbr_day_names')[5]}</Text>
            </View>
            <View style={[styles.flex_1]}>
              <Text style={[styles.week_highlight,  this.props.headerStyle]}>{I18n.t('date.abbr_day_names')[6]}</Text>
            </View>
            <View style={[styles.flex_1]}>
              <Text style={[styles.week_highlight,  this.props.headerStyle]}>{I18n.t('date.abbr_day_names')[0]}</Text>
            </View>
          </View>

          <ScrollView keyboardShouldPersistTaps={true} style={{flex:1}} automaticallyAdjustContentInsets={false}>

            {items}

          </ScrollView>

        </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'blue'
  },
  flex_1:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  calendar_container:{
    backgroundColor:'#fff',
    flex:1,
    paddingBottom: 49,
    borderTopWidth:1/PixelRatio.get(),
    borderBottomWidth:1/PixelRatio.get(),
    borderColor:'#ccc'
  },
  row_header:{
    paddingTop: 20,
    backgroundColor:'#F5F5F5',
    height:55,
    borderBottomWidth:1/PixelRatio.get(),
    borderBottomColor:'#ccc',
  },
  row:{
    flexDirection:'row',
    height:35,
  },
  month:{
    alignItems:'center',
    justifyContent:'center',
    height:40,
  },
  month_text:{
    fontSize:18,
    fontWeight:'400',
  },
  week_highlight:{
    color:'#23B8FC'
  },
  cm_bottom:{
    borderBottomWidth:1/PixelRatio.get(),
    borderBottomColor:'#ccc',
  }
});
