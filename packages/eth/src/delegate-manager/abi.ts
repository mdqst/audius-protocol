export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_claimer',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_rewards',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_newTotal',
        type: 'uint256'
      }
    ],
    name: 'Claim',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_newClaimsManagerAddress',
        type: 'address'
      }
    ],
    name: 'ClaimsManagerAddressUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_newGovernanceAddress',
        type: 'address'
      }
    ],
    name: 'GovernanceAddressUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_increaseAmount',
        type: 'uint256'
      }
    ],
    name: 'IncreaseDelegatedStake',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_maxDelegators',
        type: 'uint256'
      }
    ],
    name: 'MaxDelegatorsUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_minDelegationAmount',
        type: 'uint256'
      }
    ],
    name: 'MinDelegationUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_removeDelegatorEvalDuration',
        type: 'uint256'
      }
    ],
    name: 'RemoveDelegatorEvalDurationUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_removeDelegatorLockupDuration',
        type: 'uint256'
      }
    ],
    name: 'RemoveDelegatorLockupDurationUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      }
    ],
    name: 'RemoveDelegatorRequestCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_unstakedAmount',
        type: 'uint256'
      }
    ],
    name: 'RemoveDelegatorRequestEvaluated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_lockupExpiryBlock',
        type: 'uint256'
      }
    ],
    name: 'RemoveDelegatorRequested',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_spMinDelegationAmount',
        type: 'uint256'
      }
    ],
    name: 'SPMinDelegationAmountUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_newServiceProviderFactoryAddress',
        type: 'address'
      }
    ],
    name: 'ServiceProviderFactoryAddressUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_target',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_newTotal',
        type: 'uint256'
      }
    ],
    name: 'Slash',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_newStakingAddress',
        type: 'address'
      }
    ],
    name: 'StakingAddressUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: '_undelegateLockupDuration',
        type: 'uint256'
      }
    ],
    name: 'UndelegateLockupDurationUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'UndelegateStakeRequestCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'UndelegateStakeRequestEvaluated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_lockupExpiryBlock',
        type: 'uint256'
      }
    ],
    name: 'UndelegateStakeRequested',
    type: 'event'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_governanceAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_undelegateLockupDuration',
        type: 'uint256'
      }
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_targetSP',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'delegateStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_target',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'requestUndelegateStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'cancelUndelegateStakeRequest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'undelegateStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      }
    ],
    name: 'claimRewards',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_slashAddress',
        type: 'address'
      }
    ],
    name: 'slash',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      }
    ],
    name: 'requestRemoveDelegator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      }
    ],
    name: 'cancelRemoveDelegatorRequest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      }
    ],
    name: 'removeDelegator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_spMinDelegationAmount',
        type: 'uint256'
      }
    ],
    name: 'updateSPMinDelegationAmount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_duration',
        type: 'uint256'
      }
    ],
    name: 'updateUndelegateLockupDuration',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_maxDelegators',
        type: 'uint256'
      }
    ],
    name: 'updateMaxDelegators',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_minDelegationAmount',
        type: 'uint256'
      }
    ],
    name: 'updateMinDelegationAmount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_duration',
        type: 'uint256'
      }
    ],
    name: 'updateRemoveDelegatorLockupDuration',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_duration',
        type: 'uint256'
      }
    ],
    name: 'updateRemoveDelegatorEvalDuration',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_governanceAddress',
        type: 'address'
      }
    ],
    name: 'setGovernanceAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_stakingAddress',
        type: 'address'
      }
    ],
    name: 'setStakingAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_spFactory',
        type: 'address'
      }
    ],
    name: 'setServiceProviderFactoryAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_claimsManagerAddress',
        type: 'address'
      }
    ],
    name: 'setClaimsManagerAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_sp',
        type: 'address'
      }
    ],
    name: 'getDelegatorsList',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      }
    ],
    name: 'getTotalDelegatorStake',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_sp',
        type: 'address'
      }
    ],
    name: 'getTotalDelegatedToServiceProvider',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_sp',
        type: 'address'
      }
    ],
    name: 'getTotalLockedDelegationForServiceProvider',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      }
    ],
    name: 'getDelegatorStakeForServiceProvider',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      }
    ],
    name: 'getPendingUndelegateRequest',
    outputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'lockupExpiryBlock',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_delegator',
        type: 'address'
      }
    ],
    name: 'getPendingRemoveDelegatorRequest',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '_serviceProvider',
        type: 'address'
      }
    ],
    name: 'getSPMinDelegationAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getUndelegateLockupDuration',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getMaxDelegators',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getMinDelegationAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getRemoveDelegatorLockupDuration',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getRemoveDelegatorEvalDuration',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getGovernanceAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getServiceProviderFactoryAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getClaimsManagerAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getStakingAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
] as const
