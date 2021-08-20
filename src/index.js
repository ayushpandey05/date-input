import React, { Component } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from "@hybrid/core-components";
import Calendar from "./Calendar";
import { CalendarIcon, CrossIcon } from "./Images";
import moment from "moment";

const defaultDateIconSyle = {
  width: 16,
  height: 16,
  color: "black",
};

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
};

const defaultDropdownStyle = {
  width: 300,
  height: 300,
  borderRadius: 8,
  margin: 5,
  backgroundColor: "white",
  ...shadowStyle,
};

class DateInput extends Component {
  state = { isActive: false };
  onFocus = (e) => {
    const { onFocus } = this.props;
    this.setState({ isActive: true }, () => {
      if (typeof onFocus === "function") {
        onFocus(e);
      }
    });
  };
  onBlur = (e) => {
    const { onBlur } = this.props;
    if (typeof onBlur === "function") {
      onBlur(e);
    }
  };

  onDateSelect = (value) => {
    const { onChangeValue } = this.props;
    this.setState({ isActive: false });
    if (typeof onChangeValue === "function") {
      onChangeValue(value);
    }
  };

  clearValue = () => {
    const { onChangeValue } = this.props;
    if (typeof onChangeValue === "function") {
      onChangeValue();
    }
  };
  onInputTextChange = (inputValue)=>{
    this.setState({inputValue})
  }
  onInputFocus = (e) => {
    this.setState({ inputFocus: true });
  };
  onInputBlur = (e) => {
    const { onChangeValue } = this.props;
    const { inputValue } = this.state;
    let newValue = inputValue;
    newValue = newValue && new Date(newValue);
    if (newValue instanceof Date && !isNaN(newValue)) {
      if (typeof onChangeValue === "function") {
        onChangeValue(newValue);
      }
    }

    this.setState({
      inputFocus: false,
      inputValue: null,
    });
  };
  render() {
    const windowWidth = Dimensions.get("window").width;
    const { isActive, inputFocus, inputValue } = this.state;
    const {
      inputStyle,
      crossImage,
      calendarImage,
      dateIconSyle: dateIconSyleProp,
      ...restProps
    } = this.props;
    const dateIconSyle = dateIconSyleProp || defaultDateIconSyle;
    const { value } = restProps || {};
    let valueToShow = value && moment(value).format("DD/MM/YYYY");
    valueToShow = valueToShow || "";
    const activeStyle = { borderWidth: 1, borderColor: "blue" };
    const style = { borderWidth: 1, borderColor: "transparent" };
    const crossIconComponent = crossImage ? (
      <Image style={dateIconSyle} source={crossImage} />
    ) : (
      <Image source={CrossIcon} style={dateIconSyle} />
    );
    const calendarIconComponent = calendarImage ? (
      <Image style={dateIconSyle} source={calendarImage} />
    ) : (
      <Image source={CalendarIcon} style={dateIconSyle} />
    );
    return (
      <View>
        <View
          onLayout={(e) => {
            console.log("@@@@@@@@@@@@@@@@!>>>>>>", e);
          }}
          style={{
            backgroundColor: "grey",
            flexDirection: "row",
            ...(isActive || inputFocus ? activeStyle : style),
          }}
        >
          <View style={{ flex: 1, paddingLeft: 5 }}>
            <TextInput
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              onChangeText={this.onInputTextChange}
              style={{
                height: 36,
                padding: 0,
                color: "black",
                fontSize: 18,
                fontWeight: "bold",
              }}
              value={inputValue || valueToShow}
            />
            {/* {windowWidth > 650 ? (
              <TouchableOpacity
                onPress={this.onFocus}
                style={{
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  position: "absolute",
                }}
              />
            ) : (
              void 0
            )} */}
          </View>
          <TouchableOpacity
            style={{
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={value ? this.clearValue : this.onFocus}
          >
            {value ? crossIconComponent : calendarIconComponent}
          </TouchableOpacity>
        </View>
        <Modal visible={isActive} transparent>
          <TouchableOpacity
            onPress={() => {
              this.setState({ isActive: false });
            }}
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
              cursor: "default",
            }}
          >
            <Calendar
              {...restProps}
              dropdownStyle={defaultDropdownStyle}
              onDateSelect={this.onDateSelect}
              onBlur={this.onBlur}
            />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

export { DateInput };
