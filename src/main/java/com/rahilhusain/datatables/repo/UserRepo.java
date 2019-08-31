package com.rahilhusain.datatables.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.querydsl.binding.SingleValueBinding;

import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;
import com.rahilhusain.datatables.entity.QUser;
import com.rahilhusain.datatables.entity.User;

public interface UserRepo
		extends JpaRepository<User, Integer>, QuerydslPredicateExecutor<User>, QuerydslBinderCustomizer<QUser> {
	@Override
	default public void customize(QuerydslBindings bindings, QUser root) {
		bindings.bind(String.class)
				.first((SingleValueBinding<StringPath, String>) StringExpression::containsIgnoreCase);
//		StringPath search = Expressions.stringPath("search");
//		bindings.bind(search).first((SingleValueBinding<StringPath, String>) StringExpression::containsIgnoreCase);
	}

}
