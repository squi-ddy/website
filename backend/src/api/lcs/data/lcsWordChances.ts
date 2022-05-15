import LCSChances from "../types/lcsChances"

export default {
    "chancesArray": [
        [
            {
                "startsWith": "l",
                "weight": 95
            },
            {
                "startsWith": "lam",
                "weight": 2.5
            },
            {
                "startsWith": "lim",
                "weight": 2.5
            }
        ],
        [
            {
                "startsWith": "c",
                "weight": 95
            },
            {
                "startsWith": "char",
                "weight": 2.5
            },
            {
                "startsWith": "cle",
                "weight": 2.5
            }
        ],
        [
            {
                "startsWith": "s",
                "weight": 95
            },
            {
                "startsWith": "sus",
                "weight": 5
            }
        ],
        [
            {
                "startsWith": "sus",
                "weight": 100
            }
        ]
    ]
} as LCSChances