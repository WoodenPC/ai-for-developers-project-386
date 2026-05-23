/* eslint-disable */
// This file is generated from packages/api-dto/dist/openapi/openapi.yaml.
// Run pnpm --filter @calls-calendar/backend generate:contract-schemas to update it.

export const contractSchemas = {
  "OwnerApi_getOwner": {
    "response": {
      "200": {
        "type": "object",
        "required": [
          "id",
          "name",
          "email"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string",
            "minLength": 1
          },
          "email": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    }
  },
  "OwnerApi_listEventTypes": {
    "response": {
      "200": {
        "type": "array",
        "items": {
          "type": "object",
          "required": [
            "id",
            "title",
            "description",
            "durationMinutes"
          ],
          "properties": {
            "id": {
              "type": "integer"
            },
            "title": {
              "type": "string",
              "minLength": 1
            },
            "description": {
              "type": "string",
              "minLength": 1
            },
            "durationMinutes": {
              "type": "integer",
              "minimum": 1
            }
          }
        }
      }
    }
  },
  "OwnerApi_getEventType": {
    "response": {
      "200": {
        "type": "object",
        "required": [
          "id",
          "title",
          "description",
          "durationMinutes"
        ],
        "properties": {
          "id": {
            "type": "integer"
          },
          "title": {
            "type": "string",
            "minLength": 1
          },
          "description": {
            "type": "string",
            "minLength": 1
          },
          "durationMinutes": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "404": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "OwnerApi_createEventType": {
    "body": {
      "type": "object",
      "required": [
        "title",
        "description",
        "durationMinutes"
      ],
      "properties": {
        "title": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string",
          "minLength": 1
        },
        "durationMinutes": {
          "type": "integer",
          "minimum": 1
        }
      }
    },
    "response": {
      "201": {
        "type": "object",
        "required": [
          "id",
          "title",
          "description",
          "durationMinutes"
        ],
        "properties": {
          "id": {
            "type": "integer"
          },
          "title": {
            "type": "string",
            "minLength": 1
          },
          "description": {
            "type": "string",
            "minLength": 1
          },
          "durationMinutes": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "400": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "409": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "OwnerApi_updateEventType": {
    "body": {
      "type": "object",
      "required": [
        "title",
        "description",
        "durationMinutes"
      ],
      "properties": {
        "title": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string",
          "minLength": 1
        },
        "durationMinutes": {
          "type": "integer",
          "minimum": 1
        }
      }
    },
    "response": {
      "200": {
        "type": "object",
        "required": [
          "id",
          "title",
          "description",
          "durationMinutes"
        ],
        "properties": {
          "id": {
            "type": "integer"
          },
          "title": {
            "type": "string",
            "minLength": 1
          },
          "description": {
            "type": "string",
            "minLength": 1
          },
          "durationMinutes": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "400": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "404": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "OwnerApi_listUpcomingBookings": {
    "response": {
      "200": {
        "type": "array",
        "items": {
          "type": "object",
          "required": [
            "id",
            "eventTypeId",
            "eventTypeTitle",
            "guestName",
            "startAt",
            "endAt",
            "createdAt"
          ],
          "properties": {
            "id": {
              "type": "string"
            },
            "eventTypeId": {
              "type": "integer"
            },
            "eventTypeTitle": {
              "type": "string",
              "minLength": 1
            },
            "guestName": {
              "type": "string",
              "minLength": 1
            },
            "startAt": {
              "type": "string",
              "format": "date-time"
            },
            "endAt": {
              "type": "string",
              "format": "date-time"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        }
      }
    }
  },
  "Public_listEventTypes": {
    "response": {
      "200": {
        "type": "array",
        "items": {
          "type": "object",
          "required": [
            "id",
            "title",
            "description",
            "durationMinutes"
          ],
          "properties": {
            "id": {
              "type": "integer"
            },
            "title": {
              "type": "string",
              "minLength": 1
            },
            "description": {
              "type": "string",
              "minLength": 1
            },
            "durationMinutes": {
              "type": "integer",
              "minimum": 1
            }
          }
        }
      }
    }
  },
  "Public_getEventType": {
    "response": {
      "200": {
        "type": "object",
        "required": [
          "id",
          "title",
          "description",
          "durationMinutes"
        ],
        "properties": {
          "id": {
            "type": "integer"
          },
          "title": {
            "type": "string",
            "minLength": 1
          },
          "description": {
            "type": "string",
            "minLength": 1
          },
          "durationMinutes": {
            "type": "integer",
            "minimum": 1
          }
        }
      },
      "404": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "Public_listSlots": {
    "querystring": {
      "additionalProperties": false,
      "properties": {
        "fromDate": {
          "type": "string",
          "format": "date"
        }
      },
      "required": [
        "fromDate"
      ],
      "type": "object"
    },
    "response": {
      "200": {
        "type": "array",
        "items": {
          "type": "object",
          "required": [
            "eventTypeId",
            "startAt",
            "endAt",
            "available"
          ],
          "properties": {
            "eventTypeId": {
              "type": "integer"
            },
            "startAt": {
              "type": "string",
              "format": "date-time"
            },
            "endAt": {
              "type": "string",
              "format": "date-time"
            },
            "available": {
              "type": "boolean"
            }
          }
        }
      },
      "400": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "404": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  },
  "Public_createBooking": {
    "body": {
      "type": "object",
      "required": [
        "eventTypeId",
        "startAt",
        "guestName"
      ],
      "properties": {
        "eventTypeId": {
          "type": "integer"
        },
        "startAt": {
          "type": "string",
          "format": "date-time"
        },
        "guestName": {
          "allOf": [
            {
              "type": "string",
              "minLength": 1
            }
          ]
        }
      }
    },
    "response": {
      "201": {
        "type": "object",
        "required": [
          "id",
          "eventTypeId",
          "eventTypeTitle",
          "guestName",
          "startAt",
          "endAt",
          "createdAt"
        ],
        "properties": {
          "id": {
            "type": "string"
          },
          "eventTypeId": {
            "type": "integer"
          },
          "eventTypeTitle": {
            "type": "string",
            "minLength": 1
          },
          "guestName": {
            "type": "string",
            "minLength": 1
          },
          "startAt": {
            "type": "string",
            "format": "date-time"
          },
          "endAt": {
            "type": "string",
            "format": "date-time"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "400": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "404": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "409": {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  }
} as const;

export type ContractOperationId = keyof typeof contractSchemas;
