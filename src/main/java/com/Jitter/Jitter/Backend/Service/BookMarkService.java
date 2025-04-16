package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.BookMark;
import com.Jitter.Jitter.Backend.Repository.BookMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookMarkService {

    @Autowired
    private final BookMarkRepository bookMarkRepository;

    public BookMarkService(BookMarkRepository bookMarkRepository) {
        this.bookMarkRepository = bookMarkRepository;
    }

    public List<BookMark> getByUserId(String userId) {
        return bookMarkRepository.findByUserId(userId);
    }

    public Optional<BookMark> getByUserAndPost(String userId, String postId) {
        return bookMarkRepository.findByUserIdAndPostId(userId, postId);
    }

    public BookMark save(BookMark bookmark) {
        return bookMarkRepository.save(bookmark);
    }

    public void delete(String id) {
        bookMarkRepository.deleteById(id);
    }
}
