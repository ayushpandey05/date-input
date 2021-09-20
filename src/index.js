import React, { Component } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
} from "@react-easy-ui/core-components";
import Calendar from "./Calendar";
import { CalendarIcon, CrossIcon } from "./Images";
import moment from "moment";

const STATUS_BAR_HEIGHT = 0;

const defaultDateIconSyle = {
  width: 16,
  height: 16,
  padding: 10,
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

  _updatePosition = (callback) => {
    console.log("@@@@@@@@!>>>>>>>working", this._button, this._button.measure);
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = { x: px, y: py, w: width, h: height };
        callback && callback();
      });
    }
  };

  componentDidMount() {
    this._updatePosition();
  }

  _calcPosition = () => {
    let {
      // dropdownStyle = defaultDropdownStyle,
      // style = defaultDateIconSyle,
      adjustFrame,
      position,
    } = this.props;
    let dropdownStyle = defaultDropdownStyle;
    let style = defaultDateIconSyle;
    const { keyboardHeight } = this.state;
    const dimensions = Dimensions.get("window");
    const windowWidth = dimensions.width;
    let windowHeight = dimensions.height;
    if (keyboardHeight) {
      windowHeight -= keyboardHeight;
    }
    if (dropdownStyle) {
      dropdownStyle = StyleSheet.flatten(dropdownStyle);
    }
    if (style) {
      style = StyleSheet.flatten(style);
    }
    let marginBottom =
      (dropdownStyle && dropdownStyle.marginBottom) ||
      (style && style.marginBottom) ||
      0;
    if (!marginBottom) {
      marginBottom =
        (dropdownStyle && dropdownStyle.margin) || (style && style.margin) || 0;
    }
    let marginTop =
      (dropdownStyle && dropdownStyle.marginTop) ||
      (style && style.marginTop) ||
      0;
    if (!marginTop) {
      marginTop =
        (dropdownStyle && dropdownStyle.margin) || (style && style.margin) || 0;
    }
    let topBottomMargin = marginTop + marginBottom;

    const dropdownHeight = (dropdownStyle && dropdownStyle.height) || 0;
    //check whether modal should open in top or bottom
    let availableBottomSpace =
      windowHeight -
      this._buttonFrame.y -
      this._buttonFrame.h -
      STATUS_BAR_HEIGHT;
    let availabelTopSpace =
      this._buttonFrame.y - STATUS_BAR_HEIGHT - topBottomMargin;

    let showInBottom =
      dropdownHeight <= availableBottomSpace ||
      availableBottomSpace >= availabelTopSpace;
    if (
      showInBottom &&
      position === "top" &&
      dropdownHeight &&
      dropdownHeight <= availabelTopSpace
    ) {
      showInBottom = false;
    }

    let modalHeight = 0;
    let modalTopPosition = 0;
    let modalBottomPosition = 0;
    //here we decide the modal height and modal top position
    if (showInBottom) {
      modalHeight =
        dropdownHeight <= availableBottomSpace
          ? dropdownHeight
          : availableBottomSpace;
      modalTopPosition =
        this._buttonFrame.y +
        this._buttonFrame.h -
        (Platform.OS === "ios" ? STATUS_BAR_HEIGHT : 0);
    } else {
      //check if  space is sufficient for default given height or not
      modalHeight =
        dropdownHeight <= availabelTopSpace
          ? dropdownHeight
          : availabelTopSpace;
      modalBottomPosition =
        windowHeight - STATUS_BAR_HEIGHT - this._buttonFrame.y;
    }
    const dropdownWidth =
      (dropdownStyle && dropdownStyle.width) ||
      (style && style.width) ||
      this._buttonFrame.w;
    const positionStyle = {
      position: "absolute",
    };

    positionStyle.width = dropdownWidth;
    if (modalHeight !== undefined) {
      positionStyle.height = modalHeight;
    }
    if (modalTopPosition) {
      positionStyle.top = modalTopPosition;
    }
    if (modalBottomPosition) {
      positionStyle.bottom = modalBottomPosition;
    }

    const rightSpace = windowWidth - this._buttonFrame.x;
    let showInRight = rightSpace >= dropdownWidth;
    if (
      showInRight &&
      position === "left" &&
      dropdownWidth < this._buttonFrame.x
    ) {
      showInRight = false;
    }

    if (showInRight) {
      positionStyle.left = this._buttonFrame.x;
    } else {
      const dropdownWidth =
        (dropdownStyle && dropdownStyle.width) || (style && style.width) || -1;
      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }
      positionStyle.right = rightSpace - this._buttonFrame.w;
    }
    // console.warn('position style', positionStyle);
    this.modalPositionStyle = adjustFrame
      ? adjustFrame(positionStyle, this.state)
      : positionStyle;
    this.onFocus();
    return this.modalPositionStyle;
  };

  onFocus = (e) => {
    console.log("!!@!@#>@!>#>>>");
    const { onFocus } = this.props;
    this.setState({ isActive: true, inputValue: null }, () => {
      this.dateInputRef?.blur && this.dateInputRef.blur();
      if (typeof onFocus === "function") {
        onFocus(e);
      }
    });
  };

  onButtonPress = () => {
    console.log("@@@buttonPress");
    this._updatePosition(this._calcPosition);
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
      this.setState({ inputValue: null });
    }
  };
  onInputTextChange = (inputValue) => {
    this.setState({ inputValue });
  };
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
  getInputRef = (ref) => {
    this.dateInputRef = ref;
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
          style={{
            backgroundColor: "grey",
            flexDirection: "row",
            ...(isActive || inputFocus ? activeStyle : style),
          }}
        >
          <View style={{ flex: 1, paddingLeft: 5 }}>
            <TextInput
              getRef={this.getInputRef}
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
            getRef={(button) => (this._button = button)}
            style={{
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={value || inputValue ? this.clearValue : this.onButtonPress}
          >
            {value || inputValue ? crossIconComponent : calendarIconComponent}
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
              frameStyle={this.modalPositionStyle}
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
