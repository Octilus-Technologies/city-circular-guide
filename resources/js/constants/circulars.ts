import airRailAcwCircular from "@/constants/air-rail-acw.json";
import airRailCircular from "@/constants/air-rail.json";
import blueAcwCircular from "@/constants/blue-acw.json";
import blueCircular from "@/constants/blue.json";
import brownAcwCircular from "@/constants/brown-acw.json";
import brownCircular from "@/constants/brown.json";
import greenAcwCircular from "@/constants/green-acw.json";
import greenCircular from "@/constants/green.json";
import magentaAcwCircular from "@/constants/magenta-acw.json";
import magentaCircular from "@/constants/magenta.json";
import redAcwCircular from "@/constants/red-acw.json";
import redCircular from "@/constants/red.json";

// * Register all circulars here
const circulars = {
    blue: blueCircular,
    red: redCircular,
    green: greenCircular,
    magenta: magentaCircular,
    brown: brownCircular,
    air_rail: airRailCircular,
};

// * Register all ACW circulars here
export const acwCirculars = {
    blue: blueAcwCircular,
    red: redAcwCircular,
    green: greenAcwCircular,
    magenta: magentaAcwCircular,
    brown: brownAcwCircular,
    air_rail: airRailAcwCircular,
};

// may integrate this details in geojson file
export const meta = [
    {
        id: "1A",
        label: "Red - ACW",
        name: "Red",
        isClockwise: false,
        color: "hsl(0, 100%, 70%)",
    },
    {
        id: "1C",
        label: "Red - CW",
        name: "Red",
        isClockwise: true,
        color: "hsl(0, 100%, 70%)",
    },
    {
        id: "2A",
        label: "Blue - ACW",
        name: "Blue",
        isClockwise: false,
        color: "hsl(239, 100%, 70%)",
    },
    {
        id: "2C",
        label: "Blue - CW",
        name: "Blue",
        isClockwise: true,
        color: "hsl(239, 100%, 70%)",
    },
    {
        id: "3A",
        label: "Magenta - ACW",
        name: "Magenta",
        isClockwise: false,
        color: "hsl(300, 90%, 60%)",
    },
    {
        id: "3C",
        label: "Magenta - CW",
        name: "Magenta",
        isClockwise: true,
        color: "hsl(300, 90%, 60%)",
    },
    {
        id: "4A",
        label: "Yellow - ACW",
        name: "Yellow",
        isClockwise: false,
        color: "hsl(53, 82%, 60%)",
    },
    {
        id: "4C",
        label: "Yellow - CW",
        name: "Yellow",
        isClockwise: true,
        color: "hsl(53, 82%, 60%)",
    },
    {
        id: "5A",
        label: "Violet - ACW",
        name: "Violet",
        isClockwise: false,
        color: "hsl(300, 100%, 40%)",
    },
    {
        id: "5C",
        label: "Violet - CW",
        name: "Violet",
        isClockwise: true,
        color: "hsl(300, 100%, 40%)",
    },
    {
        id: "6A",
        label: "Brown - ACW",
        name: "Brown",
        isClockwise: false,
        color: "hsl(0, 59%, 60%)",
    },
    {
        id: "6C",
        label: "Brown - CW",
        name: "Brown",
        isClockwise: true,
        color: "hsl(0, 59%, 60%)",
    },
    {
        id: "7A",
        label: "Green - ACW",
        name: "Green",
        isClockwise: false,
        color: "hsl(123, 38%, 50%)",
    },
    {
        id: "7C",
        label: "Green - CW",
        name: "Green",
        isClockwise: true,
        color: "hsl(123, 38%, 50%)",
    },
    {
        id: "8A",
        label: "Air-Rail - ACW",
        name: "Air-Rail",
        isClockwise: false,
        color: "#FFA500",
    },
    {
        id: "8C",
        label: "Air-Rail - CW",
        name: "Air-Rail",
        isClockwise: true,
        color: "#FFA500",
    },
];

export default circulars;
