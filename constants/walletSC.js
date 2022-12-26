export const WALLET_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_signingAddress",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "guardian",
                type: "address",
            },
        ],
        name: "GuardianAdded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "guardian",
                type: "address",
            },
        ],
        name: "GuardianRemoved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "recoverIndex",
                type: "uint256",
            },
        ],
        name: "RecoveryCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "recoverIndex",
                type: "uint256",
            },
        ],
        name: "RecoveryExecuted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "recoverCycle",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "newSigningAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address[]",
                name: "requiredGuardians",
                type: "address[]",
            },
            {
                indexed: false,
                internalType: "address",
                name: "initiator",
                type: "address",
            },
        ],
        name: "RecoveryInitiated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "recoverIndex",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "guardianSupported",
                type: "address",
            },
        ],
        name: "RecoverySupported",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "withdrawIndex",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "guardianApproved",
                type: "address",
            },
        ],
        name: "WithdrawRequestApproved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "withdrawIndex",
                type: "uint256",
            },
        ],
        name: "WithdrawRequestCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "withdrawIndex",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "receiver",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address[]",
                name: "requiredGuardians",
                type: "address[]",
            },
        ],
        name: "WithdrawRequestCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "walletAddr",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "withdrawIndex",
                type: "uint256",
            },
        ],
        name: "WithdrawRequestExecuted",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_guardian",
                type: "address",
            },
        ],
        name: "addGuardian",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "approveWithdrawRequest",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelRecovery",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "cancelWithdrawRequest",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "_receiver",
                type: "address",
            },
        ],
        name: "createWithdrawRequest",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "executeRecovery",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "txType",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "from",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "to",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsPerPubdataByteLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxPriorityFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "paymaster",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256[6]",
                        name: "reserved",
                        type: "uint256[6]",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "factoryDeps",
                        type: "bytes32[]",
                    },
                    {
                        internalType: "bytes",
                        name: "paymasterInput",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "reservedDynamic",
                        type: "bytes",
                    },
                ],
                internalType: "struct Transaction",
                name: "_transaction",
                type: "tuple",
            },
        ],
        name: "executeTransaction",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "txType",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "from",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "to",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsPerPubdataByteLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxPriorityFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "paymaster",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256[6]",
                        name: "reserved",
                        type: "uint256[6]",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "factoryDeps",
                        type: "bytes32[]",
                    },
                    {
                        internalType: "bytes",
                        name: "paymasterInput",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "reservedDynamic",
                        type: "bytes",
                    },
                ],
                internalType: "struct Transaction",
                name: "_transaction",
                type: "tuple",
            },
        ],
        name: "executeTransactionFromOutside",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "executeWithdrawRequest",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getGuardians",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getRecoveryCycle",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getRecoveryState",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getSigningAddress",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getWithdrawRequestsCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "guardians",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_newSigningAddress",
                type: "address",
            },
        ],
        name: "initiateRecovery",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_hash",
                type: "bytes32",
            },
            {
                internalType: "bytes",
                name: "_signature",
                type: "bytes",
            },
        ],
        name: "isValidSignature",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "txType",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "from",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "to",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsPerPubdataByteLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxPriorityFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "paymaster",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256[6]",
                        name: "reserved",
                        type: "uint256[6]",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "factoryDeps",
                        type: "bytes32[]",
                    },
                    {
                        internalType: "bytes",
                        name: "paymasterInput",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "reservedDynamic",
                        type: "bytes",
                    },
                ],
                internalType: "struct Transaction",
                name: "_transaction",
                type: "tuple",
            },
        ],
        name: "payForTransaction",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "txType",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "from",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "to",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsPerPubdataByteLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxPriorityFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "paymaster",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256[6]",
                        name: "reserved",
                        type: "uint256[6]",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "factoryDeps",
                        type: "bytes32[]",
                    },
                    {
                        internalType: "bytes",
                        name: "paymasterInput",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "reservedDynamic",
                        type: "bytes",
                    },
                ],
                internalType: "struct Transaction",
                name: "_transaction",
                type: "tuple",
            },
        ],
        name: "prePaymaster",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "removeGuardian",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "supportRecovery",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "_suggestedSignedHash",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "txType",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "from",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "to",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "ergsPerPubdataByteLimit",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "maxPriorityFeePerErg",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "paymaster",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256[6]",
                        name: "reserved",
                        type: "uint256[6]",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "signature",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes32[]",
                        name: "factoryDeps",
                        type: "bytes32[]",
                    },
                    {
                        internalType: "bytes",
                        name: "paymasterInput",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "reservedDynamic",
                        type: "bytes",
                    },
                ],
                internalType: "struct Transaction",
                name: "_transaction",
                type: "tuple",
            },
        ],
        name: "validateTransaction",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];
