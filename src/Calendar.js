import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "@react-easy-ui/core-components";
import { LeftIcon, RightIcon } from "./Images";

const defaultCalendarStyle = {
  arrowStyle: {
    container: {
      padding: 10,
    },
    icon: {
      width: 24,
      height: 24,
      color: "black",
    },
  },
  headerStyle: {
    container: {
      paddingTop: 10,
      paddingBottom: 10,
      alignItems: "center",
    },
    textStyle: {
      fontSize: 20,
    },
  },
  rowStyle: {
    wrapperStyle: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    weekWrapperStyle: { backgroundColor: "#ddd" },
    containerStyle: {
      //   flex: 1,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    daySize: { width: 24, height: 24, borderRadius: 12 },
    monthSize: { width: 34, height: 34, borderRadius: 17 },
    yearSize: { width: 40, height: 34, borderRadius: 10 },
    weekContainerStyle: { width: 32 },
    selectedContainerStyle: { backgroundColor: "#33FFFC" },
    textStyle: {
      color: "black",
    },
    weekTextStyle: {},
    weekendTextStyle: { color: "red" },
    selectedTextStyle: { fontWeight: "bold" },
  },
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    let { value } = props;
    value = value && JSON.parse(JSON.stringify(value));
    value = value && new Date(value);
    this.state = {
      activeDate: value || new Date(),
      showYear: false,
      showMonth: false,
    };
    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    this.nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }

  generateMatrix = () => {
    var matrix = [];
    // Create header
    matrix[0] = this.weekDays;

    // More code here
    var year = this.state.activeDate.getFullYear();
    var month = this.state.activeDate.getMonth();

    var firstDay = new Date(year, month, 1).getDay();
    var maxDays = this.nDays[month];
    if (month == 1) {
      // February
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }
    var counter = 1;
    for (var row = 1; row < 7; row++) {
      matrix[row] = [];
      for (var col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  };
  _onPress = (item) => {
    const { activeDate } = this.state;
    if (!item?.match && item != -1) {
      activeDate.setDate(item);
      this.setState({ activeDate }, () => {
        const { onDateSelect } = this.props;
        onDateSelect && onDateSelect(this.state.activeDate);
      });
    }
  };
  changeYear = (n) => {
    const { activeDate } = this.state;
    const year = activeDate.getFullYear();
    activeDate.setFullYear(year + n * 9);
    this.setState({ activeDate });
  };
  _onPressYear = (item) => {
    const { activeDate } = this.state;
    const date = activeDate.getDate();
    activeDate.setFullYear(item);
    if (activeDate.getDate() !== date) {
      activeDate.setDate(0);
    }
    this.setState({ activeDate, showYear: false });
  };
  _onPressMonth = (item) => {
    const { activeDate } = this.state;
    const date = activeDate.getDate();
    activeDate.setMonth(item);
    if (activeDate.getDate() !== date) {
      activeDate.setDate(0);
    }
    this.setState({ activeDate, showMonth: false });
  };
  changeMonth = (n) => {
    const { activeDate } = this.state;
    const date = activeDate.getDate();
    let newMonth = activeDate.getMonth() + n;
    activeDate.setMonth(newMonth);
    if (activeDate.getDate() !== date) {
      activeDate.setDate(0);
    }
    this.setState({ activeDate });
  };

  renderRows = () => {
    const { calendarStyle: calendarStyleProp } = this.props;
    const rowStyle =
      calendarStyleProp?.rowStyle || defaultCalendarStyle?.rowStyle;
    const matrix = this.generateMatrix();
    let rows = [];
    rows = matrix.map((row, rowIndex) => {
      let rowItems = row.map((item, colIndex) => {
        return (
          <TouchableOpacity
            key={`${rowIndex}_${colIndex}`}
            {...(!(item >= 1 || item <= 31) && { activeOpacity: 1 })}
            style={{
              ...rowStyle?.containerStyle,
              ...rowStyle?.daySize,
              ...(rowIndex == 0 && rowStyle?.weekContainerStyle),
              ...(item == this.state.activeDate.getDate() &&
                rowStyle?.selectedContainerStyle),
              ...(!(item >= 1 || item <= 31) && { cursor: "default" }),
              ...(item === -1 && {
                cursor: "default",
                backgroundColor: "transparent",
              }),
            }}
            onPress={() => this._onPress(item)}
          >
            <Text
              style={{
                ...rowStyle?.textStyle,
                ...(colIndex == 0 && rowStyle?.weekendTextStyle),
                ...(rowIndex == 0 && rowStyle?.weekTextStyle),
                ...(item == this.state.activeDate.getDate() &&
                  rowStyle?.selectedTextStyle),
                ...(item === -1 && {
                  backgroundColor: "transparent",
                }),
                userSelect: 'none'
              }}
            >
              {item != -1 ? item : ""}
            </Text>
          </TouchableOpacity>
        );
      });
      return (
        <View
          key={`wrapper_${rowIndex}`}
          style={{
            ...rowStyle?.wrapperStyle,
            ...(rowIndex == 0 && rowStyle?.weekWrapperStyle),
          }}
        >
          {rowItems}
        </View>
      );
    });
    return rows;
  };

  renderYearRows = () => {
    const { calendarStyle: calendarStyleProp } = this.props;
    const rowStyle =
      calendarStyleProp?.rowStyle || defaultCalendarStyle?.rowStyle;
    const year = this.state.activeDate.getFullYear();
    let rows = [];
    let columns = [];
    let counter = 0;
    for (let item = year - 4; item <= year + 4; item++) {
      const yearItem = (
        <TouchableOpacity
          key={`year_${counter}`}
          style={{
            ...rowStyle?.containerStyle,
            ...(item == year && rowStyle?.selectedContainerStyle),
            ...rowStyle?.yearSize,
          }}
          onPress={() => this._onPressYear(item)}
        >
          <Text
            style={{
              ...rowStyle?.textStyle,
              ...(item == year && rowStyle?.selectedTextStyle),
              userSelect: 'none'
            }}
          >
            {item || ""}
          </Text>
        </TouchableOpacity>
      );
      columns.push(yearItem);
      counter = counter + 1;
      if (counter % 3 === 0) {
        rows.push(
          <View
            key={`year_wrapper_${year - item}`}
            style={{ ...rowStyle?.wrapperStyle }}
          >
            {columns}
          </View>
        );
        columns = [];
      }
    }
    return rows;
  };

  renderMonthRows = () => {
    const { calendarStyle: calendarStyleProp } = this.props;
    const rowStyle =
      calendarStyleProp?.rowStyle || defaultCalendarStyle?.rowStyle;
    const { activeDate } = this.state;
    const month = this.months[activeDate.getMonth()];
    let rows = [];
    let columns = [];
    for (let item = 0; item < 12; item++) {
      let monthName = this.months[item] || "";
      monthName = monthName.substring(0, 3);
      const monthItem = (
        <TouchableOpacity
          key={`month_${item}`}
          style={{
            ...rowStyle?.containerStyle,
            ...(this.months[item] == month && rowStyle?.selectedContainerStyle),
            ...rowStyle?.monthSize,
          }}
          onPress={() => this._onPressMonth(item)}
        >
          <Text
            style={{
              ...rowStyle?.textStyle,
              ...(this.months[item] == month && rowStyle?.selectedTextStyle),
              userSelect: 'none'
            }}
          >
            {monthName}
          </Text>
        </TouchableOpacity>
      );
      columns.push(monthItem);
      if ((item + 1) % 4 === 0) {
        rows.push(
          <View
            key={`month_wrapper_${item}`}
            style={{ ...rowStyle?.wrapperStyle }}
          >
            {columns}
          </View>
        );
        columns = [];
      }
    }
    return rows;
  };

  renderHeader = () => {
    const { showYear, showMonth, activeDate } = this.state;
    const {
      calendarStyle: calendarStyleProp,
      leftArrow,
      rightArrow,
    } = this.props;

    const arrowStyle =
      calendarStyleProp?.arrowStyle || defaultCalendarStyle?.arrowStyle;
    const headerStyle =
      calendarStyleProp?.headerStyle || defaultCalendarStyle?.headerStyle;
    let leftArrowComponent = leftArrow ? (
      <Image source={leftArrow} style={arrowStyle?.icon} />
    ) : (
      <Image source={LeftIcon} style={arrowStyle?.icon} />
    );
    let rightArrowComponent = rightArrow ? (
      <Image source={rightArrow} style={arrowStyle?.icon} />
    ) : (
      <Image source={RightIcon} style={arrowStyle?.icon} />
    );

    let headerComponent = null;
    if (showMonth) {
      headerComponent = (
        <View style={{ ...headerStyle?.container }}>
          <Text style={{ ...headerStyle?.textStyle, userSelect: 'none' }}>Select Month</Text>
        </View>
      );
    } else if (showYear) {
      headerComponent = (
        <View style={{ flex: 1 }}>
          <View style={{ ...headerStyle?.container }}>
            <Text style={{ ...headerStyle?.textStyle, userSelect: 'none' }}>Select Year</Text>
          </View>
        </View>
      );
    } else {
      headerComponent = (
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showMonth: true });
            }}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{userSelect: 'none'}}>{`${this.months[activeDate.getMonth()]}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showYear: true });
            }}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{userSelect: 'none'}}>{`${activeDate.getFullYear()}`}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!showMonth) {
      headerComponent = (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ ...arrowStyle?.container }}
            onPress={() => {
              showYear ? this.changeYear(-1) : this.changeMonth(-1);
            }}
          >
            {leftArrowComponent}
          </TouchableOpacity>
          {headerComponent}
          <TouchableOpacity
            style={{ ...arrowStyle?.container }}
            onPress={() => {
              showYear ? this.changeYear(+1) : this.changeMonth(+1);
            }}
          >
            {rightArrowComponent}
          </TouchableOpacity>
        </View>
      );
    }

    return headerComponent;
  };
  componentWillUnmount() {
    const { onBlur } = this.props;
    if (typeof onBlur === "function") {
      onBlur();
    }
  }
  render() {
    const { showYear, showMonth } = this.state;
    const { frameStyle, dropdownStyle } = this.props;
    let rows = this.renderRows();
    if (showYear) {
      rows = this.renderYearRows();
    } else if (showMonth) {
      rows = this.renderMonthRows();
    }
    const header = this.renderHeader();
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          cursor: "default",
          ...frameStyle,
          ...dropdownStyle,
        }}
      >
        {header}
        {rows}
      </TouchableOpacity>
    );
  }
}

export default Calendar;
