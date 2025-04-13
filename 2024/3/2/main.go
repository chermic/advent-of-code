package main

import (
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
)

func main() {
	file, err := os.ReadFile("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	inputString := string(file[:])

	operationRegexp := `do(?:n't)?\(\)`
	multiplyRegexp := `mul\(\d+,\d+\)`

	generalRegexp := fmt.Sprintf(`(?:%v)|(?:%v)`, multiplyRegexp, operationRegexp)

	re, err := regexp.Compile(generalRegexp)

	if err != nil {
		log.Panic(err)
	}

	match := re.FindAllStringSubmatch(inputString, -1)

	operationRegexpCompiled, err := regexp.Compile(operationRegexp)

	result := 0

	multiplyEnabled := true
	for _, v := range match {
		operation := v[0]
		if operationRegexpCompiled.MatchString(operation) {
			if operation == "do()" {
				multiplyEnabled = true
			} else {
				multiplyEnabled = false
			}
		} else if multiplyEnabled {
			numbersRegexp, _ := regexp.Compile(`\d+`)
			numbers := numbersRegexp.FindAllStringSubmatch(operation, -1)

			multiplier1, _ := strconv.Atoi(numbers[0][0])
			multiplier2, _ := strconv.Atoi(numbers[1][0])

			result += (multiplier1) * (multiplier2)

			log.Println(result)
		}

	}
}
