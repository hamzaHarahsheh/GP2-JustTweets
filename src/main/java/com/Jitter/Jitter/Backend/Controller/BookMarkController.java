package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.BookMark;
import com.Jitter.Jitter.Backend.Repository.BookMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookmarks")
public class BookMarkController {

    @Autowired
    private BookMarkRepository bookMarkRepo;

    @PostMapping("/add")
    public BookMark addBookMark(@RequestBody BookMark bookMark) {
        return bookMarkRepo.save(bookMark);
    }

    @GetMapping("/{id}")
    public Optional<BookMark> getBookMarkById(@PathVariable String id) {
        return bookMarkRepo.findById(id);
    }

    @GetMapping
    public List<BookMark> getAllBookMarks() {
        return bookMarkRepo.findAll();
    }

    @PutMapping("/{id}")
    public BookMark updateBookMark(@PathVariable String id, @RequestBody BookMark updatedBookMark) {
        updatedBookMark.setId(id);
        return bookMarkRepo.save(updatedBookMark);
    }

    @DeleteMapping("/{id}")
    public void deleteBookMark(@PathVariable String id) {
        bookMarkRepo.deleteById(id);
    }
}
