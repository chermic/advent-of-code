package main

import "log"

func Maps(x []int) []int {
	slice := make([]int, len(x))

	for index, value := range x {

		slice[index] = value * 2
	}

	return slice
}

func main() {
	slice := []int{1, 2, 3, 4}
	log.Println(Maps(slice))
}
