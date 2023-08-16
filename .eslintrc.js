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