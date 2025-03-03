package main

import (
	"log"
	"os"
	"regexp"
)

func main() {
	file, err := os.ReadFile("input.txt")

	if err != nil {
		log.Fatal(err)
	}

	inputString := string(file[:])

	re, err := regexp.Compile(`((mul\(\d+,\d+\))|(do(n't)?\(\)))`)

	if err != nil {
		log.Panic(err)
	}

	match := re.FindAllStringSubmatch(inputString, -1)
	log.Println(match)

	// for _, v := range match {
	// 	log.Println(v)
	// }
	// for k, v := range file {
	// 	log.Printf("key=%v, value=%v", k, utf8.decode v.)
	// }
}
