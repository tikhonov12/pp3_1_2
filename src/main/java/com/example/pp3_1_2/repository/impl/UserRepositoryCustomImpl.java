package com.example.pp3_1_2.repository.impl;


import com.example.pp3_1_2.model.User;
import com.example.pp3_1_2.repository.UserRepositoryCustom;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class UserRepositoryCustomImpl implements UserRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void detachUser(User u) {
        entityManager.detach(u);
    }
}
