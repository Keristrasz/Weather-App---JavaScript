//creating new map, we could also use imperative way with switch/loop

export const ICON_MAP = new Map();

addMapping([0, 1], "fa-sun");
addMapping([2], "fa-cloud-sun");
addMapping([3], "fa-cloud");
addMapping([45, 48], "fa-smog");
addMapping([53, 55, 56, 57, 63, 65, 67, 81, 82], "fa-cloud-showers-heavy");
addMapping([51, 61, 66, 80], "fa-cloud-rain");
addMapping([71, 73, 75, 77, 85, 86], "fa-snowflake");
addMapping([95, 96, 99], "fa-bolt");
addMapping([101], "fa-moon");

function addMapping(values, icon) {
  values.forEach((value) => {
    ICON_MAP.set(value, icon);
  });
}

// now we can use ICON_MAP.get(iconcode) for returning classname for icon
