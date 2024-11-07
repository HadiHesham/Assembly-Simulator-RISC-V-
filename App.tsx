import React, { useState } from "react";
import "./App.css";

function App() {
  const [Code, setCode] = useState([]);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");
  const [Instructions, setInstructions] = useState([]);
  const [Registers, setRegisters] = useState([]);
  const [Labels, setLabels] = useState<String[]>([]);
  const [RanLine, setRanLine] = useState<String[]>([]);
  const [start, setStart] = useState(0);
  let timedOut = false;
  const convertToBinary = (decimalNumber) => {
    if (decimalNumber === "") return "0".repeat(32);
    return (parseInt(decimalNumber, 10) >>> 0).toString(2).padStart(32, "0");
  };
  const binaryToDecimal = (binaryString) => {
    return parseInt(binaryString, 2);
  };
  function sleep(ms: number | undefined) {
    return new Promise<void>((resolve) => {
      if (ms === undefined) {
        throw new Error("Timeout duration must be provided");
      }

      timedOut = false; // Reset the flag before starting the sleep

      const timer = setTimeout(() => {
        timedOut = true; // Change the flag to true once the timeout completes
        resolve();
      }, ms);
    });
  }
  const [RegistersContent, setRegistersContent] = useState<number[]>(
    Array(32).fill(0)
  ); // Updated to size 32
  const [memoryContents, setMemoryContents] = useState(
    new Map<string, string>()
  );
  const Start = () => {
    setStart(Number(text4));
  };
  const UserInput = () => {
    let binary = convertToBinary(text3);
    console.log(text3);
    console.log(binary);
    setMemoryContents((prev) => {
      const updatedMap = new Map(prev);

      // Split the binary string into 8-bit chunks and store them in an array
      const chunks = [
        binary.substring(0, 8),
        binary.substring(8, 16),
        binary.substring(16, 24),
        binary.substring(24, 32),
      ];

      // Set the array of chunks under the key `text2`
      updatedMap.set(text2, chunks[3]);
      updatedMap.set(String(Number(text2) + 1), chunks[2]);
      updatedMap.set(String(Number(text2) + 2), chunks[1]);
      updatedMap.set(String(Number(text2) + 3), chunks[0]);
      return updatedMap;
    });
  };
  const init = () => {
    const zeroregs = Array(32).fill(0);
    setRegistersContent(zeroregs);
    setInstructions([]);
    setLabels([]);
    setCode([]);
    setRegisters([]);
    setRanLine([]);
    setMemoryContents(new Map<string, string>());
  };
  const SetCode = async () => {
    const Lines = text1.split("\n");
    setCode(Lines);
    let instructs = [];
    let registers = [];
    let labels = [];
    let i = 0;
    while (i < Lines.length && i != Lines.length + 5) {
      let instruct;
      const Line = Lines[i].split(/\s+/);
      {
        if (
          Line[0].replace(":", "") == "pause" ||
          Line[0].replace(":", "") == "ebreak" ||
          Line[0].replace(":", "") == "ecall" ||
          Line[0].replace(":", "") == "fence" ||
          Line[0].replace(":", "") == "fence.tso"
        ) {
          i = Lines.length + 5;
        }
        if (Lines[i].includes(":")) {
          labels.push(Line[0].replace(":", "") + " " + "PC: " + String(i + 1));
          instruct = Line[1];
          instructs.push(Line[1]);
          registers.push(Line[2]);
        } else {
          instruct = Line[0];
          instructs.push(Line[0]);
          registers.push(Line[1]);
        }
        let filtered_registers;
        try {
          filtered_registers = registers[registers.length - 1]?.split(","); // Use the last registered line

          if (
            instruct === "addi" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly

            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] + immediateValue; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "add" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length &&
              rs2Index >= 0 &&
              rs2Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] + newRegistersContent[rs2Index]; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "sub" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length &&
              rs2Index >= 0 &&
              rs2Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] - newRegistersContent[rs2Index]; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "slli" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly

            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] << immediateValue; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "sll" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length &&
              rs2Index >= 0 &&
              rs2Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] << newRegistersContent[rs2Index]; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "srli" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly

            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] >>> immediateValue; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "srl" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length &&
              rs2Index >= 0 &&
              rs2Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] >>> newRegistersContent[rs2Index]; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "sra" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length &&
              rs2Index >= 0 &&
              rs2Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;

              newRegistersContent[rdIndex] = Math.trunc(
                newRegistersContent[rs1Index] /
                  Math.pow(2, newRegistersContent[rs2Index])
              ); // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "srai" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly

            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] = Math.trunc(
                newRegistersContent[rs1Index] / Math.pow(2, immediateValue)
              );

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "andi" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly

            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] & immediateValue;

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "and" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length &&
              rs2Index >= 0 &&
              rs2Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;

              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] & newRegistersContent[rs2Index]; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "or" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length &&
              rs2Index >= 0 &&
              rs2Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;

              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] | newRegistersContent[rs2Index]; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "ori" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly

            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] | immediateValue;

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "xor" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length &&
              rs2Index >= 0 &&
              rs2Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;

              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] ^ newRegistersContent[rs2Index]; // Correctly add the immediate value

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "mul" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid

            const newRegistersContent = RegistersContent;

            newRegistersContent[rdIndex] =
              newRegistersContent[rs1Index] * newRegistersContent[rs2Index]; // Correctly add the immediate value

            setRegistersContent(newRegistersContent); // Update state
          }
          if (
            instruct === "div" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", ""); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", ""); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", ""); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2);
            // Ensure indices are valid

            const newRegistersContent = RegistersContent;

            newRegistersContent[rdIndex] = Math.trunc(
              newRegistersContent[rs1Index] / newRegistersContent[rs2Index]
            ); // Correctly add the immediate value

            setRegistersContent(newRegistersContent); // Update state
          }
          if (
            instruct === "xori" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly

            // Ensure indices are valid
            if (
              rdIndex >= 0 &&
              rdIndex < RegistersContent.length &&
              rs1Index >= 0 &&
              rs1Index < RegistersContent.length
            ) {
              const newRegistersContent = RegistersContent;
              newRegistersContent[rdIndex] =
                newRegistersContent[rs1Index] ^ immediateValue;

              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "lw" &&
            filtered_registers[0].replace("x", "") !== "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // Remove 'x' from rd
            const rs1 = filtered_registers[1]
              .replace("x", "")
              .trim()
              .replace(")", ""); // Remove 'x' from rs1
            const rs1split = rs1.split("(");

            const offset = Number(rs1split[0].trim()); // Convert offset to number
            const address = Number(rs1split[1].trim()); // Convert address part to number

            // Calculate base address for memory access
            const baseAddress = RegistersContent[address] + offset * 4;

            // Fetch 8-bit chunks in little-endian order
            const key3 = String(baseAddress + 3);
            const key2 = String(baseAddress + 2);
            const key1 = String(baseAddress + 1);
            const key0 = String(baseAddress);

            // Retrieve each chunk from memoryContents and concatenate in little-endian order
            const concatenatedBinary =
              (memoryContents.get(key3) || "00000000") +
              (memoryContents.get(key2) || "00000000") +
              (memoryContents.get(key1) || "00000000") +
              (memoryContents.get(key0) || "00000000");

            console.log("Concatenated Binary:", concatenatedBinary);

            // Convert binary string to decimal
            const decimalValue = parseInt(concatenatedBinary, 2);
            console.log("Decimal Value:", decimalValue);

            // Update the register with the loaded value
            const newRegistersContent = [...RegistersContent];
            newRegistersContent[Number(rd)] = decimalValue;

            setRegistersContent(newRegistersContent); // Update state
          }

          if (
            instruct === "sw" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rs1 = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rd = filtered_registers[1]
              .replace("x", "")
              .trim()
              .replace(")", ""); // remove 'x' from rs1
            const rdf = rd.split("(")[1];
            const offset = filtered_registers[1].substring(
              0,
              filtered_registers[1].indexOf("(")
            );
            console.log(rdf);
            console.log(rs1);
            console.log(offset);
            let binary = convertToBinary(String(RegistersContent[Number(rs1)]));
            setMemoryContents((prev) => {
              const updatedMap = new Map(prev);

              // Split the binary string into 8-bit chunks and store them in an array
              const chunks = [
                binary.substring(0, 8),
                binary.substring(8, 16),
                binary.substring(16, 24),
                binary.substring(24, 32),
              ];

              // Set the array of chunks under the key `text2`
              updatedMap.set(
                String(
                  Number(
                    String(RegistersContent[Number(rdf)] + Number(offset) * 4)
                  )
                ),
                chunks[3]
              );
              updatedMap.set(
                String(
                  Number(
                    String(RegistersContent[Number(rdf)] + Number(offset) * 4)
                  ) + 1
                ),
                chunks[2]
              );
              updatedMap.set(
                String(
                  Number(
                    String(RegistersContent[Number(rdf)] + Number(offset) * 4)
                  ) + 2
                ),
                chunks[1]
              );
              updatedMap.set(
                String(
                  Number(
                    String(RegistersContent[Number(rdf)] + Number(offset) * 4)
                  ) + 3
                ),
                chunks[0]
              );
              return updatedMap;
            });
          }
          if (
            instruct === "lui" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const immediate = filtered_registers[1].trim();
            RegistersContent[Number(rd)] = Number(immediate) << 12;
          }
          if (
            instruct === "auipc" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const immediate = filtered_registers[1].trim();
            RegistersContent[Number(rd)] = (Number(immediate) << 12) + i + 1;
          }
          if (
            instruct === "jal" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const label = filtered_registers[1].trim();
            let j = i + 1;
            let found = true;
            while (j < Lines.length && found) {
              if (Lines[j].includes(label)) {
                RegistersContent[Number(rd)] = i + 1;
                i = j - 1;
                found = false;
              }
              j++;
            }
          }
          if (instruct === "jalr") {
            const rd = filtered_registers[1]
              .replace("x", "")
              .trim()
              .replace(")", ""); // remove 'x' from rs1
            const rdf = rd.split("(")[1];
            const offset = filtered_registers[1][0];
            i = RegistersContent[Number(rdf)] + Number(offset) - 1;
          }
          if (instruct === "beq") {
            const rs1 = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs2 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rd
            const label = filtered_registers[2].trim();
            if (
              RegistersContent[Number(rs1)] == RegistersContent[Number(rs2)]
            ) {
              let j = i + 1;
              let found = true;
              while (j < Lines.length && found) {
                if (Lines[j].includes(label)) {
                  i = j - 1;
                  found = false;
                }
                j++;
              }
            }
          }
          if (instruct === "bne") {
            const rs1 = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs2 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rd
            const label = filtered_registers[2].trim();
            if (
              RegistersContent[Number(rs1)] != RegistersContent[Number(rs2)]
            ) {
              let j = i + 1;
              let found = true;
              while (j < Lines.length && found) {
                if (Lines[j].includes(label)) {
                  i = j - 1;
                  found = false;
                }
                j++;
              }
            }
          }
          if (instruct === "blt") {
            const rs1 = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs2 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rd
            const label = filtered_registers[2].trim();
            if (RegistersContent[Number(rs1)] < RegistersContent[Number(rs2)]) {
              let j = i + 1;
              let found = true;
              while (j < Lines.length && found) {
                if (Lines[j].includes(label)) {
                  i = j - 1;
                  found = false;
                }
                j++;
              }
            }
          }
          if (instruct === "bge") {
            const rs1 = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs2 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rd
            const label = filtered_registers[2].trim();
            if (RegistersContent[Number(rs1)] > RegistersContent[Number(rs2)]) {
              let j = i + 1;
              let found = true;
              while (j < Lines.length && found) {
                if (Lines[j].includes(label)) {
                  i = j - 1;
                  found = false;
                }
                j++;
              }
            }
          }
          if (instruct === "bltu") {
            const rs1 = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs2 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rd
            const label = filtered_registers[2].trim();
            let temp1 = RegistersContent[Number(rs1)];
            let temp2 = RegistersContent[Number(rs2)];
            if (RegistersContent[Number(rs1)] < 0)
              temp1 = RegistersContent[Number(rs1)] * -1;
            if (RegistersContent[Number(rs2)] < 0)
              temp2 = RegistersContent[Number(rs2)] * -1;
            if (temp1 < temp2) {
              let j = i + 1;
              let found = true;
              while (j < Lines.length && found) {
                if (Lines[j].includes(label)) {
                  i = j - 1;
                  found = false;
                }
                j++;
              }
            }
          }
          if (instruct === "bgeu") {
            const rs1 = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs2 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rd
            const label = filtered_registers[2].trim();
            let temp1 = RegistersContent[Number(rs1)];
            let temp2 = RegistersContent[Number(rs2)];
            if (RegistersContent[Number(rs1)] < 0)
              temp1 = RegistersContent[Number(rs1)] * -1;
            if (RegistersContent[Number(rs2)] < 0)
              temp2 = RegistersContent[Number(rs2)] * -1;
            if (temp1 > temp2) {
              let j = i + 1;
              let found = true;
              while (j < Lines.length && found) {
                if (Lines[j].includes(label)) {
                  i = j - 1;
                  found = false;
                }
                j++;
              }
            }
          }
          if (
            instruct === "slti" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const newRegistersContent = RegistersContent;
            if (Number(RegistersContent[rs1Index]) < Number(immediateValue)) {
              newRegistersContent[rdIndex] = 1;
              setRegistersContent(newRegistersContent); // Update state
            } else {
              newRegistersContent[rdIndex] = 0;
              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "slt" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", "").trim(); // remove 'x' from rs1
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const rs2Index = Number(rs2); // Use rs1 as index directly
            const newRegistersContent = RegistersContent;
            if (RegistersContent[rs1Index] < RegistersContent[rs2Index]) {
              newRegistersContent[rdIndex] = 1;
              setRegistersContent(newRegistersContent); // Update state
            } else {
              newRegistersContent[rdIndex] = 0;
              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "sltu" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            const rs2 = filtered_registers[2].replace("x", "").trim(); // remove 'x' from rs1
            const rdIndex = Number(rd); // Use rd as index directly
            const newRegistersContent = RegistersContent;
            let temp1 = RegistersContent[Number(rs1)];
            let temp2 = RegistersContent[Number(rs2)];
            if (RegistersContent[Number(rs1)] < 0)
              temp1 = RegistersContent[Number(rs1)] * -1;
            if (RegistersContent[Number(rs2)] < 0)
              temp2 = RegistersContent[Number(rs2)] * -1;
            if (Number(temp1) < Number(temp2)) {
              newRegistersContent[rdIndex] = 1;
              setRegistersContent(newRegistersContent); // Update state
            } else {
              newRegistersContent[rdIndex] = 0;
              setRegistersContent(newRegistersContent); // Update state
            }
          }
          if (
            instruct === "sltiu" &&
            filtered_registers[0].replace("x", "") != "0"
          ) {
            const rd = filtered_registers[0].replace("x", "").trim(); // remove 'x' from rd
            const rs1 = filtered_registers[1].replace("x", "").trim(); // remove 'x' from rs1
            let immediateValue = Number(filtered_registers[2].trim()); // Convert to number
            const rdIndex = Number(rd); // Use rd as index directly
            const rs1Index = Number(rs1); // Use rs1 as index directly
            const newRegistersContent = RegistersContent;
            let temp1 = RegistersContent[Number(rs1)];
            if (RegistersContent[Number(rs1)] < 0)
              temp1 = RegistersContent[Number(rs1)] * -1;
            if (immediateValue < 0) {
              immediateValue = immediateValue * -1;
            }
            if (Number(RegistersContent[rs1Index]) < Number(immediateValue)) {
              newRegistersContent[rdIndex] = 1;
              setRegistersContent(newRegistersContent); // Update state
            } else {
              newRegistersContent[rdIndex] = 0;
              setRegistersContent(newRegistersContent); // Update state
            }
          }
        } catch (error) {
          // Handle any potential errors that may arise
        }
      }
      setRanLine([...RanLine, start + i * 4 + ": " + Lines[i]]);
      i++;
      console.log(memoryContents);
      await sleep(1000);
    }
  };
  return (
    <div>
      <div>
        Memory Address:{" "}
        <input onChange={(e) => setText2(e.target.value)}></input>
        Memory Content:{" "}
        <input onChange={(e) => setText3(e.target.value)}></input>
        <button className="Post" style={{ width: "40vw" }} onClick={UserInput}>
          Enter Memory
        </button>
      </div>
      <div>
        Start Address:{" "}
        <input onChange={(e) => setText4(e.target.value)}></input>
        <button
          className="Post"
          style={{ width: "40vw", marginBottom: 80 }}
          onClick={Start}
        >
          Enter Start
        </button>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <textarea
            type="text"
            rows={20}
            onChange={(e) => setText1(e.target.value)}
          ></textarea>
          <button className="Post" style={{ width: "13vw" }} onClick={SetCode}>
            Enter
          </button>
          <button className="Post" style={{ width: "13vw" }} onClick={init}>
            Clear Registers
          </button>
        </div>
        <div>
          <h3>Ran Line:</h3>
          <div>
            {RanLine.map((Lines, index) => (
              <div key={index}>{Lines}</div>
            ))}
          </div>
        </div>
        <div>
          <h3>Registers Content:</h3>
          {
            <div>
              {RegistersContent.map(
                (register, index) =>
                  register != 0 && (
                    <div key={index}>
                      x{index}: {register}
                    </div>
                  )
              )}
            </div>
          }
        </div>
        <div>
          <h3>Memory Contents:</h3>
          <div>
            {Array.from(memoryContents.entries()).map(([key, value]) => (
              <div>
                Address {key}: {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
