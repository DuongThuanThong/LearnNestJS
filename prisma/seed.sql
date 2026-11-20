-- Get-Content prisma/seed.sql -raw | docker compose exec -T db psql -U app -d learn_nestjs -v ON_ERROR_STOP=1
-- dùng lệnh trên để chạy seed này vào db :>
begin;
do $$
DECLARE
   fiction_id text := gen_random_uuid();
   science_id text := gen_random_uuid();
   technology_id text := gen_random_uuid();
   history_id text := gen_random_uuid();
   business_id text := gen_random_uuid();
   children_id text := gen_random_uuid();
   philosophy_id text := gen_random_uuid();
   poetry_id text := gen_random_uuid();

BEGIN

insert into categories (id, name, created_at) VALUES
(fiction_id,'Fiction', now()),
(science_id,'Science', now()),
(technology_id,'Technology', now()),
(history_id,'History', now()),
(business_id,'Business', now()),
(children_id,'Children', now()),
(philosophy_id,'Philosophy', now()),
(poetry_id,'Poetry', now());

insert into books (id, title, author, isbn, price, published_at, update_at,created_at, category_id) values
(gen_random_uuid(),'The Old Man and the Sea','Ernest Hemingway','9780684801223',12.99,'1952-09-01',now(),now(),fiction_id),
(gen_random_uuid(),'A Farewell to Arms','Ernest Hemingway','9780684801469',14.50,'1929-09-27',now(),now(),fiction_id),
(gen_random_uuid(),'The Great Gatsby','F. Scott Fitzgerald','9780743273565',10.99,'1925-04-10',now(),now(),fiction_id),
(gen_random_uuid(),'1984','George Orwell','9780451524935',9.99,'1949-06-08',now(),now(),fiction_id),
(gen_random_uuid(),'Animal Farm','George Orwell','9780452284241',8.50,'1945-08-17',now(),now(),fiction_id),
(gen_random_uuid(),'Norwegian Wood','Haruki Murakami','9780375704024',15.75,'1987-09-04',now(),now(),fiction_id),
(gen_random_uuid(),'Kafka on the Shore','Haruki Murakami','9781400079278',16.20,'2002-09-12',now(),now(),fiction_id),
(gen_random_uuid(),'The Road','Cormac McCarthy','9780307387899',13.40,NULL,now(),now(),fiction_id),


(gen_random_uuid(),'Clean Architecture','Robert C. Martin','9780134494166',39.99,'2017-09-20',now(),now(),technology_id),
(gen_random_uuid(),'The Pragmatic Programmer','David Thomas','9780135957059',49.99,'1999-10-30',now(),now(),technology_id),
(gen_random_uuid(),'Refactoring','Martin Fowler','9780134757599',54.99,'1999-06-28',now(),now(),technology_id),
(gen_random_uuid(),'Design Patterns','Erich Gamma','9780201633610',59.95,'1994-10-21',now(),now(),technology_id),
(gen_random_uuid(),'The Mythical Man-Month','Frederick Brooks','9780201835953',34.50,'1975-01-01',now(),now(),technology_id),
(gen_random_uuid(),'Structure and Interpretation of Computer Programs','Harold Abelson','9780262510875',68.00,'1985-07-25',now(),now(),technology_id),
(gen_random_uuid(),'You Don''t Know JS','Kyle Simpson','9781491904244',29.90,'2014-12-01',now(),now(),technology_id),
(gen_random_uuid(),'Designing Data-Intensive Applications','Martin Kleppmann','9781449373320',89.99,'2017-03-16',now(),now(),technology_id),
(gen_random_uuid(),'Eloquent JavaScript','Marijn Haverbeke','9781593279509',27.50,NULL,now(),now(),technology_id),

(gen_random_uuid(),'Guns, Germs, and Steel','Jared Diamond','9780393317558',19.99,'1997-03-01',now(),now(),history_id),
(gen_random_uuid(),'The Guns of August','Barbara Tuchman','9780345476098',18.75,'1962-01-01',now(),now(),history_id),
(gen_random_uuid(),'SPQR','Mary Beard','9781631492228',22.95,'2015-09-14',now(),now(),history_id),
(gen_random_uuid(),'The Rise and Fall of the Third Reich','William Shirer','9781451651683',32.00,'1960-10-17',now(),now(),history_id),
(gen_random_uuid(),'Postwar','Tony Judt','9780143037750',26.40,'2005-05-01',now(),now(),history_id),
(gen_random_uuid(),'The Silk Roads','Peter Frankopan','9781101912379',21.50,'2015-08-27',now(),now(),history_id),

(gen_random_uuid(),'The Lean Startup','Eric Ries','9780307887894',21.99,'2011-09-13',now(),now(),business_id),
(gen_random_uuid(),'Zero to One','Peter Thiel','9780804139298',18.50,'2014-09-16',now(),now(),business_id),
(gen_random_uuid(),'Good to Great','Jim Collins','9780066620992',25.99,'2001-10-16',now(),now(),business_id),
(gen_random_uuid(),'Thinking in Systems','Donella Meadows','9781603580557',23.75,'2008-12-15',now(),now(),business_id),
(gen_random_uuid(),'The Innovator''s Dilemma','Clayton Christensen','9781633691780',28.00,'1997-06-01',now(),now(),business_id),
(gen_random_uuid(),'Antifragile','Nassim Nicholas Taleb','9780812979688',20.00,'2012-11-27',now(),now(),business_id),

(gen_random_uuid(),'The Little Prince','Antoine de Saint-Exupery','9780156012195',7.99,'1943-04-06',now(),now(),children_id),
(gen_random_uuid(),'Charlotte''s Web','E. B. White','9780061124952',8.99,'1952-10-15',now(),now(),children_id),
(gen_random_uuid(),'Matilda','Roald Dahl','9780142410370',7.50,'1988-10-01',now(),now(),children_id),
(gen_random_uuid(),'Charlie and the Chocolate Factory','Roald Dahl','9780142410318',7.99,'1964-01-17',now(),now(),children_id),
(gen_random_uuid(),'Where the Wild Things Are','Maurice Sendak','9780060254926',9.95,'1963-04-09',now(),now(),children_id),

(gen_random_uuid(),'Meditations','Marcus Aurelius','9780140449334',11.99,'0180-01-01',now(),now(),philosophy_id),
(gen_random_uuid(),'The Republic','Plato','9780140455113',13.99,'0380-01-01',now(),now(),philosophy_id),
(gen_random_uuid(),'Thus Spoke Zarathustra','Friedrich Nietzsche','9780140441185',14.99,'1883-01-01',now(),now(),philosophy_id),
(gen_random_uuid(),'Critique of Pure Reason','Immanuel Kant','9780140447477',24.99,'1781-01-01',now(),now(),philosophy_id),
(gen_random_uuid(),'The Problems of Philosophy','Bertrand Russell','9780190211929',12.50,NULL,now(),now(),philosophy_id),
(gen_random_uuid(),'Beyond Good and Evil','Friedrich Nietzsche','9780140449235',13.50,'1886-01-01',now(),now(),philosophy_id),
(gen_random_uuid(),'Nicomachean Ethics','Aristotle','9780199213610',16.99,'0340-01-01',now(),now(),philosophy_id),
(gen_random_uuid(),'The Myth of Sisyphus','Albert Camus','9780525564454',15.00,'1942-10-16',now(),now(),philosophy_id);

END $$;

COMMIT;
