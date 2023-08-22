module.exports = {
    "parser": "@babel/eslint-parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "browser": true,
        "react-native/react-native": true
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
        "react/prop-types": 0,
        "react-native/no-unused-styles": 2,
        "react-native/split-platform-components": 2,
        "react-native/no-inline-styles": 2,

        // https://github.com/Intellicode/eslint-plugin-react-native/issues/270
        // error with <Text> and onPress callback, still present in current eslint, have to disable raw text rule
        "react-native/no-raw-text": 0,

        "react-native/sort-styles": [
            "error",
            "asc",
            {
                "ignoreClassNames": false,
                "ignoreStyleProperties": false
            }
        ],
        "indent": [
            "error",
            2
        ]
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    }
}