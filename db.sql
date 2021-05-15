CREATE TABLE mynearbyplaces.address (
	id bigserial primary key,
	address text not NULL
);

CREATE TABLE mynearbyplaces.place (
	id bigserial primary key,
	name text not NULL,
	addressid integer references mynearbyplaces.address(id)
);

CREATE TABLE mynearbyplaces.review (
	id bigserial primary key,
	comment text,
	rating integer not null,
	placeid integer references mynearbyplaces.place(id)
);
