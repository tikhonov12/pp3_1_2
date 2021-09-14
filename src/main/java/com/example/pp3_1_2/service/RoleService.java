package com.example.pp3_1_2.service;

import com.example.pp3_1_2.model.Role;


import java.util.Set;

public interface RoleService {
    Role addRole(Role role);

    void deleteById(Long id);

    Role findById(Long id);

    Role findByName(String name);

    Set<Role> getAllRoles();
}
