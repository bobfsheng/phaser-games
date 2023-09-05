drop table if exists flappy_bird_records;
create table flappy_bird_records (
    name varchar(64),
    best_score int4 not null default 0,  
    create_on timestamp not null default clock_timestamp(), 
    update_on timestamp not null default clock_timestamp()
);
alter table flappy_bird_records add constraint pk_flappy_bird_records primary key (name);


insert into flappy_bird_records (name, best_score) values 
('Bob', 18), ('George', 15), ('MaoMao', 12), ('Mia', 12), ('Codey', 12), ('Tomcat', 8)
on conflict on constraint pk_flappy_bird_records do nothing
;

select * from flappy_bird_records;

SELECT name, best_score, dense_rank() over (order by best_score desc, name) as best_rank, update_on FROM flappy_bird_records;