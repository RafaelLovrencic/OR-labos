const openapi = {
    "openapi": "3.1.0",
    "info": {
        "title": "Gameboy Katalog API",
        "version": "1.0",
        "contact": {
            "name": "Gameboy Katalog Support",
            "email": "rafael.lovrencic@fer.hr"
        },
        "license": {
            "name": "GNU General Public License v3.0",
            "url": "https://www.gnu.org/licenses/gpl-3.0.en.html"
        }
    },
    "servers": [
        {
            "url": "http://localhost:8080/api"
        }
    ],
    "components": {
        "schemas": {
            "ApiResponse": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "example": "OK"
                    },
                    "message": {
                        "type": "string",
                        "example": "Uspjesno izvrseno"
                    },
                    "response": {
                        "type": "object",
                        "additionalProperties": true
                    }
                },
                "required": ["status", "message"]
            },
            "NewGame": {
                "type": "object",
                "properties": {
                    "naziv": {
                        "type": "string"
                    },
                    "godina": {
                        "type": "integer"
                    },
                    "velicina_KB": {
                        "type": "integer",
                        "minimum": 0
                    },
                    "zanr": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "broj_igraca": {
                        "type": "integer",
                        "minimum": 1
                    },
                    "regija": {
                        "type": "string"
                    },
                    "izdavac": {
                        "type": "string"
                    },
                    "spremanje": {
                        "type": "boolean"
                    },
                    "varijante": {
                        "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "regija": {
                                        "type": "string"
                                    },
                                    "godina": {
                                        "type": "integer"
                                    }
                                },
                                "required": ["regija", "godina"]
                            }
                    },
                    "CRC": {
                        "type": "string"
                    },
                    "platforma": {
                        "type": "string"
                    }
                },
                "required": [
                    "naziv",
                    "godina",
                    "velicina_KB",
                    "zanr",
                    "broj_igraca",
                    "regija",
                    "izdavac",
                    "spremanje",
                    "CRC",
                    "platforma"
                ],
                "additionalProperties": false
            },
            "UpdateTemplate": {
                "type": "object",
                "properties": {
                    "naziv": {
                        "type": "string"
                    },
                    "godina": {
                        "type": "integer"
                    },
                    "velicina_KB": {
                        "type": "integer",
                        "minimum": 0
                    },
                    "zanr": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "broj_igraca": {
                        "type": "integer",
                        "minimum": 1
                    },
                    "regija": {
                        "type": "string"
                    },
                    "izdavac": {
                        "type": "string"
                    },
                    "spremanje": {
                        "type": "boolean"
                    },
                    "varijante": {
                        "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "regija": {
                                        "type": "string"
                                    },
                                    "godina": {
                                        "type": "integer"
                                    }
                                },
                                "required": ["regija", "godina"]
                            }
                    },
                    "CRC": {
                        "type": "string"
                    },
                    "platforma": {
                        "type": "string"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    "paths": {
        "/v1/openapi-specification": {
            "get": {
                "summary": "Dohvaca OpenAPI specifikaciju",
                "description": "Vraca OpenAPI specifikaciju u .json formatu",
                "responses": {
                    "200": {
                        "description": "Poslana OpenAPI specifikacija",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }
            }
        },
        "/v1/igre": {
            "get": {
                "summary": "Dohvaca sve igre iz baze podataka",
                "description": "Vraca polje sa svim elementima iz MongoDB baze Game Boy igara",
                "responses": {
                    "200": {
                        "description": "Dohvacena baza",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }
            }
        },
        "/v1/igre/{id}": {
            "get": {
                "summary": "Dohvaca jednu igru iz baze",
                "description": "Vraca element iz baze preko polja _id iz MongoDB kolekcije",
                "parameters": [{
                    "name": "id",
                    "in": "path",
                    "description": "ID resursa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }],
                "responses": {
                    "200": {
                        "description": "Dohvacen element preko ID-ja",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "ID objekta nije valjan"
                    },
                    "404": {
                        "description": "Ne postoji igra s tim ID-jem"
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }
            },
            "delete": {
                "summary": "Brise jednu igru iz baze",
                "description": "Uklanja iz baze jedan element koristeci polje _id iz MongoDB kolekcije",
                "parameters": [{
                    "name": "id",
                    "in": "path",
                    "description": "ID resursa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }],
                "responses": {
                    "200": {
                        "description": "Uspjesno obrisan element preko ID-ja",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Ne postoji igra s tim ID-jem"
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }
            },
            "put": {
                "summary": "Mijenja atribute igre",
                "description": "Mijenja atribute igre preko ID-ja",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UpdateTemplate"
                            }
                        }
                    }
                },
                "parameters": [{
                    "name": "id",
                    "in": "path",
                    "description": "ID resursa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }],
                "responses": {
                    "200": {
                        "description": "Igra uspjesno azurirana",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Ne postoji igra s tim ID-jem"
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }                    
                }
            }
        },
        "/v1/igre/naziv/{naziv}": {
            "get": {
                "summary": "Dohvaca igru preko naziva",
                "description": "Dohvaca iz baze sve igre s odgovarajucim nazivom",
                "parameters": [{
                    "name": "naziv",
                    "in": "path",
                    "description": "Naziv resursa",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }],
                "responses": {
                    "200": {
                        "description": "Dohvacen element preko naziva",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Ne postoji igra s tim nazivom"
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }            }
        },
        "/v1/igre/platforma/GB": {
            "get": {
                "summary": "Dohvaca igre za Game Boy",
                "description": "Dohvaca iz baze sve igre iskljucivo za platformu Game Boy",
                "responses": {
                    "200": {
                        "description": "Dohvacene igre za Game Boy",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }
            }
        },
        "/v1/igre/platforma/GBC": {
            "get": {
                "summary": "Dohvaca igre za Game Boy Color",
                "description": "Dohvaca iz baze sve igre iskljucivo za platformu Game Boy Color",
                "responses": {
                    "200": {
                        "description": "Dohvacene igre za Game Boy Color",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }
            }
        },
        "/v1/igre/platforma/GBA": {
            "get": {
                "summary": "Dohvaca igre za Game Boy Advance",
                "description": "Dohvaca iz baze sve igre iskljucivo za platformu Game Boy Advance",
                "responses": {
                    "200": {
                        "description": "Dohvacene igre za Game Boy Advance",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }
            }
        },
        "/v1/igre/noviUnos": {
            "post": {
                "summary": "Dodaje igru u bazu",
                "description": "Dodaje igru u MongoDB kolekciju koristeci podatke poslane na server unutar JSON objekta",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/NewGame"
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Uspjesno dodan element u kolekciju",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ApiResponse"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Ovaj je element vec u bazi"
                    },
                    "500": {
                        "description": "Uhvacen neocekivani error pri obradi zahtjeva"
                    }
                }
            }
        }
    }
}

module.exports = openapi;